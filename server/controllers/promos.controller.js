import mongoose from "mongoose";
import { Car } from "../models/cars.model.js";
import { Promo } from "../models/promo.model.js";
import {
  applyPromoToCar,
  getPromoStatus,
  serializePromo,
} from "../utils/promo.js";

const isAdminRole = (role) => role === "admin" || role === "renter";

const parsePromoPayload = (body = {}) => ({
  carId: body.carId || body.carID || null,
  title: String(body.title || "").trim(),
  discount: Number(body.discount),
  startDate: body.startDate ? new Date(body.startDate) : null,
  endDate: body.endDate ? new Date(body.endDate) : null,
});

const isValidDate = (value) => value instanceof Date && !Number.isNaN(value.getTime());
const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

const ensureAdmin = (req, res) => {
  if (!req.user || !isAdminRole(req.user.role)) {
    res.status(403).json({ success: false, message: "Admin access required" });
    return false;
  }

  return true;
};

const validatePromoPayload = (payload) => {
  if (!payload.carId) return "carId is required";
  if (!isValidObjectId(payload.carId)) return "Invalid carId";
  if (!payload.title) return "Promo title is required";
  if (!Number.isFinite(payload.discount) || payload.discount <= 0 || payload.discount > 100) {
    return "Discount must be a number between 1 and 100";
  }
  if (!isValidDate(payload.startDate)) return "Valid startDate is required";
  if (!isValidDate(payload.endDate)) return "Valid endDate is required";
  if (payload.endDate < payload.startDate) return "endDate must be on or after startDate";
  return null;
};

const findOverlappingPromo = async (carId, startDate, endDate, excludeId = null) => {
  const query = {
    carId,
    startDate: { $lte: endDate },
    endDate: { $gte: startDate },
  };

  if (excludeId) {
    query._id = { $ne: excludeId };
  }

  return Promo.findOne(query);
};

const ensureCarOwnership = async (carId, userId) => {
  const car = await Car.findById(carId);
  if (!car) return { error: { code: 404, message: "Car not found" } };
  if (car.uploadedBy?.toString() !== userId) {
    return { error: { code: 403, message: "You can only manage promos for your own cars" } };
  }
  return { car };
};

const ensurePromoOwnership = async (promoId, userId) => {
  const promo = await Promo.findById(promoId).populate("carId");
  if (!promo) return { error: { code: 404, message: "Promo not found" } };

  if (promo.carId?.uploadedBy?.toString() !== userId) {
    return { error: { code: 403, message: "You can only manage promos for your own cars" } };
  }

  return { promo };
};

export const getPromos = async (req, res) => {
  try {
    const { carId, adminId, status = "all" } = req.query;
    const now = new Date();
    const query = {};

    if (carId) {
      if (!isValidObjectId(carId)) {
        return res.status(400).json({ success: false, message: "Invalid carId" });
      }
      query.carId = carId;
    }

    if (status === "active") {
      query.startDate = { $lte: now };
      query.endDate = { $gte: now };
    } else if (status === "upcoming") {
      query.startDate = { $gt: now };
    } else if (status === "expired") {
      query.endDate = { $lt: now };
    }

    if (adminId) {
      if (!isValidObjectId(adminId)) {
        return res.status(400).json({ success: false, message: "Invalid adminId" });
      }

      const ownerCars = await Car.find({ uploadedBy: adminId }).select("_id");
      query.carId = { $in: ownerCars.map((car) => car._id) };
    }

    const promos = await Promo.find(query)
      .populate("carId")
      .populate("createdBy", "name email")
      .sort({ startDate: 1, createdAt: -1 });

    const serialized = promos
      .filter((promo) => promo.carId)
      .map((promo) => {
        const normalizedPromo = serializePromo(promo, promo.carId, now);
        return { ...normalizedPromo, status: getPromoStatus(normalizedPromo, now) };
      });

    res.status(200).json({ success: true, promos: serialized });
  } catch (error) {
    console.error("GET /promos error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch promos" });
  }
};

export const createPromo = async (req, res) => {
  if (!ensureAdmin(req, res)) return;

  try {
    const payload = parsePromoPayload(req.body);
    const validationMessage = validatePromoPayload(payload);

    if (validationMessage) {
      return res.status(400).json({ success: false, message: validationMessage });
    }

    const { car, error: ownershipError } = await ensureCarOwnership(payload.carId, req.userId);
    if (ownershipError) {
      return res
        .status(ownershipError.code)
        .json({ success: false, message: ownershipError.message });
    }

    const overlappingPromo = await findOverlappingPromo(
      payload.carId,
      payload.startDate,
      payload.endDate
    );

    if (overlappingPromo) {
      return res.status(409).json({
        success: false,
        message: "This car already has a promo scheduled within the selected date range",
      });
    }

    const promo = await Promo.create({
      ...payload,
      createdBy: req.userId,
    });

    res.status(201).json({
      success: true,
      message: "Promo created successfully",
      promo: serializePromo(promo, car),
      car: applyPromoToCar(car, promo),
    });
  } catch (error) {
    console.error("POST /promos error:", error);
    res.status(500).json({ success: false, message: "Failed to create promo" });
  }
};

export const updatePromo = async (req, res) => {
  if (!ensureAdmin(req, res)) return;

  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid promo ID" });
    }

    const payload = parsePromoPayload(req.body);
    const validationMessage = validatePromoPayload(payload);

    if (validationMessage) {
      return res.status(400).json({ success: false, message: validationMessage });
    }

    const { promo, error: ownershipError } = await ensurePromoOwnership(id, req.userId);
    if (ownershipError) {
      return res
        .status(ownershipError.code)
        .json({ success: false, message: ownershipError.message });
    }

    if (payload.carId !== promo.carId._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "Changing the linked car is not supported. Delete and recreate the promo instead.",
      });
    }

    const overlappingPromo = await findOverlappingPromo(
      payload.carId,
      payload.startDate,
      payload.endDate,
      id
    );

    if (overlappingPromo) {
      return res.status(409).json({
        success: false,
        message: "This car already has a promo scheduled within the selected date range",
      });
    }

    promo.title = payload.title;
    promo.discount = payload.discount;
    promo.startDate = payload.startDate;
    promo.endDate = payload.endDate;
    await promo.save();

    res.status(200).json({
      success: true,
      message: "Promo updated successfully",
      promo: serializePromo(promo, promo.carId),
      car: applyPromoToCar(promo.carId, promo),
    });
  } catch (error) {
    console.error("PUT /promos/:id error:", error);
    res.status(500).json({ success: false, message: "Failed to update promo" });
  }
};

export const deletePromo = async (req, res) => {
  if (!ensureAdmin(req, res)) return;

  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid promo ID" });
    }

    const { promo, error: ownershipError } = await ensurePromoOwnership(id, req.userId);
    if (ownershipError) {
      return res
        .status(ownershipError.code)
        .json({ success: false, message: ownershipError.message });
    }

    await Promo.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Promo deleted successfully",
      carId: promo.carId._id,
    });
  } catch (error) {
    console.error("DELETE /promos/:id error:", error);
    res.status(500).json({ success: false, message: "Failed to delete promo" });
  }
};

export const getExploreCars = async (_req, res) => {
  try {
    const now = new Date();
    const activePromos = await Promo.find({
      startDate: { $lte: now },
      endDate: { $gte: now },
    })
      .populate("carId")
      .sort({ endDate: 1, createdAt: -1 });

    const cars = activePromos
      .filter((promo) => promo.carId)
      .map((promo) => applyPromoToCar(promo.carId, promo, now));

    res.status(200).json({ success: true, cars });
  } catch (error) {
    console.error("GET /explore error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch explore cars" });
  }
};
