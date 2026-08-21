import React from 'react';

interface PrintableReceiptProps {
  isOpen: boolean;
  onClose: () => void;
  tripData?: {
    id: string;
    pickup: string;
    dropoff: string;
    fare: number;
    driverName: string;
    vehiclePlate: string;
    date: string;
  };
}

export const PrintableReceiptModal: React.FC<PrintableReceiptProps> = ({ isOpen, onClose, tripData }) => {
  if (!isOpen) return null;

  const data = tripData || {
    id: 'AMEN-BD-8849',
    pickup: 'Felege Hiwot Hospital, Bahir Dar',
    dropoff: 'Grand Resort Hotel, Lake Tana',
    fare: 210,
    driverName: 'Amanuel Bekele',
    vehiclePlate: 'BD-1234-AA',
    date: new Date().toLocaleDateString()
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-extrabold text-white">Digital Trip Invoice</h3>
          <button onClick={onClose} className="text-neutral-400 hover:text-white font-bold text-lg">✕</button>
        </div>

        <div className="bg-white text-black p-6 rounded-xl space-y-4 font-mono text-sm">
          <div className="text-center border-b border-neutral-300 pb-3">
            <h2 className="text-xl font-extrabold">AMEN Ride 🇪🇹</h2>
            <p className="text-xs text-neutral-600">Bahir Dar, Amhara Region, Ethiopia</p>
            <p className="text-xs text-neutral-500 mt-1">Receipt ID: {data.id} • TIN: 0098776655</p>
          </div>

          <div className="space-y-1 text-xs">
            <p><span className="font-bold">Date:</span> {data.date}</p>
            <p><span className="font-bold">Pickup:</span> {data.pickup}</p>
            <p><span className="font-bold">Dropoff:</span> {data.dropoff}</p>
            <p><span className="font-bold">Driver:</span> {data.driverName} ({data.vehiclePlate})</p>
          </div>

          <div className="border-t border-b border-neutral-300 py-3 space-y-1 text-xs">
            <div className="flex justify-between">
              <span>Base Fare</span>
              <span>50.00 ETB</span>
            </div>
            <div className="flex justify-between">
              <span>Distance Rate</span>
              <span>140.00 ETB</span>
            </div>
            <div className="flex justify-between">
              <span>Service Fee & Tax</span>
              <span>20.00 ETB</span>
            </div>
            <div className="flex justify-between font-extrabold text-sm pt-2 border-t border-neutral-200">
              <span>Total Amount Paid</span>
              <span>{data.fare.toFixed(2)} ETB</span>
            </div>
          </div>

          <div className="text-center text-xs text-neutral-500">
            Payment Method: Telebirr / Cash
            <p className="font-bold mt-1">Thank you for riding with AMEN!</p>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold py-2.5 rounded-xl text-sm transition"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 bg-amber-500 hover:bg-amber-400 text-black font-extrabold py-2.5 rounded-xl text-sm transition shadow-lg shadow-amber-500/20"
          >
            🖨️ Print Receipt
          </button>
        </div>
      </div>
    </div>
  );
};
