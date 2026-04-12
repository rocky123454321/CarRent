import React, { useMemo, useState } from "react";
import { CalendarDays, Pencil, Plus, Tag, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePromoStore } from "../../store/PromoStore";
import { formatPeso, getPromoStatus } from "../../utils/promo";

const toDateInputValue = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
};

const buildInitialForm = (carId, promo = null) => ({
  carId,
  title: promo?.title || "",
  discount: promo?.discount || "",
  startDate: toDateInputValue(promo?.startDate),
  endDate: toDateInputValue(promo?.endDate),
});

const statusTone = {
  active: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
  upcoming: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300",
  expired: "bg-zinc-100 text-zinc-600 dark:bg-white/10 dark:text-zinc-300",
  inactive: "bg-zinc-100 text-zinc-600 dark:bg-white/10 dark:text-zinc-300",
};

const PromoManagerDialog = ({ car, promos = [], onRefresh }) => {
  const { createPromo, updatePromo, deletePromo, isSubmitting } = usePromoStore();
  const [open, setOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState(null);
  const [form, setForm] = useState(buildInitialForm(car._id));

  const sortedPromos = useMemo(
    () =>
      [...promos].sort(
        (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      ),
    [promos]
  );

  const resetForm = (promo = null) => {
    setEditingPromo(promo);
    setForm(buildInitialForm(car._id, promo));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      carId: car._id,
      title: form.title.trim(),
      discount: Number(form.discount),
      startDate: form.startDate,
      endDate: form.endDate,
    };

    if (editingPromo?._id) {
      await updatePromo(editingPromo._id, payload);
    } else {
      await createPromo(payload);
    }

    await onRefresh?.();
    resetForm();
    setOpen(false);
  };

  const handleDelete = async (promoId) => {
    await deletePromo(promoId);
    await onRefresh?.();

    if (editingPromo?._id === promoId) {
      resetForm();
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) resetForm();
      }}
    >
      <DialogTrigger asChild>
        <Button className="rounded-2xl bg-zinc-900 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200">
          <Plus size={13} />
          {promos.length ? "Manage Promo" : "Add Promo"}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-[2rem] border-zinc-200 bg-white dark:border-white/10 dark:bg-[#090909]">
        <DialogHeader>
          <DialogTitle className="text-xl font-black tracking-tight text-zinc-900 dark:text-white">
            Promo Control Panel
          </DialogTitle>
          <DialogDescription className="text-sm text-zinc-500 dark:text-zinc-400">
            {car.brand} {car.model} • Base rate {formatPeso(car.pricePerDay)}/day
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                Promo Title
              </Label>
              <Input
                value={form.title}
                onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                placeholder="Flash Deal"
                className="h-11 rounded-xl border-zinc-200 dark:border-white/10 dark:bg-[#0d0d0d] dark:text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                Discount %
              </Label>
              <Input
                type="number"
                min="1"
                max="100"
                value={form.discount}
                onChange={(event) => setForm((current) => ({ ...current, discount: event.target.value }))}
                placeholder="15"
                className="h-11 rounded-xl border-zinc-200 dark:border-white/10 dark:bg-[#0d0d0d] dark:text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                Start Date
              </Label>
              <Input
                type="date"
                value={form.startDate}
                onChange={(event) => setForm((current) => ({ ...current, startDate: event.target.value }))}
                className="h-11 rounded-xl border-zinc-200 dark:border-white/10 dark:bg-[#0d0d0d] dark:text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                End Date
              </Label>
              <Input
                type="date"
                value={form.endDate}
                onChange={(event) => setForm((current) => ({ ...current, endDate: event.target.value }))}
                className="h-11 rounded-xl border-zinc-200 dark:border-white/10 dark:bg-[#0d0d0d] dark:text-white"
                required
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-2xl bg-zinc-900 text-[10px] font-black uppercase tracking-[0.2em] text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              {editingPromo ? "Update Promo" : "Create Promo"}
            </Button>
            {editingPromo ? (
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                onClick={() => resetForm()}
                className="rounded-2xl text-[10px] font-black uppercase tracking-[0.2em]"
              >
                Cancel
              </Button>
            ) : null}
          </div>
        </form>

        <div className="space-y-3 border-t border-zinc-200 pt-5 dark:border-white/10">
          <div className="flex items-center gap-2">
            <Tag size={14} className="text-zinc-400" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
              Existing Promos
            </p>
          </div>

          {sortedPromos.length === 0 ? (
            <div className="rounded-2xl bg-zinc-50 p-4 text-sm text-zinc-500 dark:bg-white/5 dark:text-zinc-400">
              No promos created for this car yet.
            </div>
          ) : (
            <div className="space-y-3">
              {sortedPromos.map((promo) => {
                const status = getPromoStatus(promo);
                return (
                  <div
                    key={promo._id}
                    className="rounded-2xl border border-zinc-200 p-4 dark:border-white/10"
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-black text-zinc-900 dark:text-white">
                            {promo.title}
                          </p>
                          <span
                            className={`rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-widest ${statusTone[status]}`}
                          >
                            {status}
                          </span>
                        </div>
                        <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">
                          {promo.discount}% off • {formatPeso(promo.discountedPrice || 0)}/day
                        </p>
                        <p className="inline-flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
                          <CalendarDays size={12} />
                          {new Date(promo.startDate).toLocaleDateString("en-PH")} to{" "}
                          {new Date(promo.endDate).toLocaleDateString("en-PH")}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => resetForm(promo)}
                          className="rounded-xl text-[10px] font-black uppercase tracking-[0.2em]"
                        >
                          <Pencil size={12} />
                          Edit
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handleDelete(promo._id)}
                          className="rounded-xl border-rose-200 text-[10px] font-black uppercase tracking-[0.2em] text-rose-600 hover:bg-rose-50 dark:border-rose-500/20 dark:text-rose-300 dark:hover:bg-rose-500/10"
                        >
                          <Trash2 size={12} />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PromoManagerDialog;
