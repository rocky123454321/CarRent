import React from 'react'
import AddCar from '../forms/admin/AddCar';

const AddCarPage = () => {
  return (
    <div className="space-y-8 p-8 mt-7 max-w-7xl mx-auto">
     
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Car</h1>
        <p className="text-gray-600">Add a new vehicle to your rental fleet.</p>
     

      <AddCar />
    </div>
  );
};

export default AddCarPage;

