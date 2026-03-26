

import Cards from "../components/Cards";
import BookingForm from "../components/BookingForm";

const DashboardPage = () => {


  
	return (
	  
    <div className="min-h-screen bg-gray-50">
    
      
      <div className="max-w-7xl mx-auto px-6 flex flex-col">
    
     
         
          <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
            <h3 className="text-xl font-bold mb-6 text-slate-900 flex items-center gap-2">
              Recent Rentals
            </h3>
            <Cards limit={6} />
          
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

