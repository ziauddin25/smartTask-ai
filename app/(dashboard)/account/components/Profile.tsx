import { Pencil } from 'lucide-react';
import { useClerk } from '@clerk/nextjs';

export default function Profile(){
  const {user} = useClerk();
  return (
    <div className="font-sans">
        <h1 className="text-xl mb-4">My Profile Info</h1>
      <div className="space-y-6">
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <img 
              src={user?.imageUrl} 
              alt="Profile" 
              className="w-24 h-24 rounded-full object-cover"
            />
            <div>
              <h2 className="text-xl font-bold">{user?.fullName}</h2>
              {/* <p className="text-gray-800 text-base mb-1.5 font-medium"></p>
              <p className="text-sm text-gray-400">{customData?.location}</p> */}
            </div>
          </div>
          <EditButton />
        </section>
        <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold">Personal information</h3>
            <EditButton />
          </div>
          
          <div className="grid grid-cols-2 gap-y-4">
            <InfoField label="First Name" value={user?.firstName || ''} />
            <InfoField label="Last Name" value={user?.lastName || ''} />
            <InfoField label="Email address" value={user?.emailAddresses[0]?.emailAddress || ''} />
          </div>
        </section>
      </div>
    </div>
  );
};
const InfoField = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-sm font-medium text-gray-400 mb-1">{label}</p>
    <p className="text-base font-semibold">{value}</p>
  </div>
);

const EditButton = () => (
  <button className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-full text-slate-600 hover:bg-gray-50 transition-colors text-sm font-medium">
    <span>Edit</span>
    <Pencil size={14} />
  </button>
);
