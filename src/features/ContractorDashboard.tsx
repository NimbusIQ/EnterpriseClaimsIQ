"use client";
import { useEffect, useState } from "react";
import { db } from "../services/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function ContractorDashboard() {
  const [leads, setLeads] = useState<any[]>([]);

  useEffect(() => {
    const fetchLeads = async () => {
      const querySnapshot = await getDocs(collection(db, "leads"));
      setLeads(querySnapshot.docs.map(doc => doc.data()));
    };
    fetchLeads();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Contractor Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {leads.map((lead, index) => (
          <div key={index} className="p-4 bg-white shadow rounded-lg">
            <h2 className="text-xl font-semibold">{lead.name}</h2>
            <p className="text-gray-600">{lead.address}</p>
            <p className="text-sm text-blue-500">{lead.damageStatus}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
