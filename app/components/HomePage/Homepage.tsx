"use client";

import { User } from "next-auth";
import InfoCard from "@/app/components/HomePage/InfoCard";
import { IndianRupee } from "lucide-react";
import { useAppSelector } from "@/app/store/hooks";
import {  MiscellaneousSpentSelector, mostSpentCategorySelector, selectTotalAmountSelector, selectCurrentMonthAmountSelector, setBillSummary } from "@/app/store/slices/bill";
import CustomCard from "./CustomCard";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import PieChartMonthly from "../Charts/PieChartMonthly";

interface AppProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
}

const Homepage: React.FC<AppProps> = ({ user }) => {
  const date = new Date();
  const monthName = date.toLocaleDateString('en-US', { month: 'long' });
  const [pieChartMonthlyData, setPieChartMonthlyData] = useState([]); // Fix: Default empty array
  const dispatch = useDispatch(); // ✅ Hook inside component

  const FetchSpendingSummary = async () => {
    try {
      const response = await fetch('/api/BillActions/FetchBills/GetBillsSummary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user }),
      });

      if (!response.ok) throw new Error("Failed to fetch bills");

      const responseData = await response.json();
      const data = responseData.data;
      console.log("Fetched spending summary:", data);

      dispatch(setBillSummary(data));
      // 
    } catch (error) {
      console.error("Error fetching spending summary:", error);
    }
  };

   const FetchPieChartMonthly = async() =>{
    try {
      const response = await fetch('/api/Homepage/PieChartMonthly', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) throw new Error("Failed to piechartData");

      const data = await response.json();
      const dataModified = data.data;
      setPieChartMonthlyData(dataModified);
      console.log("Fetched pie Chart Data:", data);
      // 
    } catch (error) {
      console.error("Error fetching spending summary:", error);
    }
   }  

  useEffect(() => {
    
  FetchSpendingSummary();
  FetchPieChartMonthly();

  }, [dispatch]); // ✅ Dependencies

  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'short', // "Sat"
    day: '2-digit', // "03"
    month: 'short', // "Aug"
    year: 'numeric', // "2024"
  });

  const totalAmount = useAppSelector(selectTotalAmountSelector);
  const currentMonthAmount = useAppSelector(selectCurrentMonthAmountSelector);
  const maxSpentCategory = useAppSelector(mostSpentCategorySelector);
  const miscellaneousSpent = useAppSelector(MiscellaneousSpentSelector);
  
   
  const comparisonSubtext = "50% more from last month"; // TODO: Fetch from DB

  return (
      <div className="w-full flex flex-col p-5 gap-5"> 
        <div className="text-xl">Hello {user?.name}!</div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full">
          <InfoCard title="Total Spending" icon={IndianRupee} date={`till ${formattedDate}`} amount={totalAmount} subtext={comparisonSubtext} />
          <InfoCard title="Monthly Spending" icon={IndianRupee} date={monthName} amount={currentMonthAmount.amount} subtext={currentMonthAmount.comparison} />
          <InfoCard title="Most Spend" icon={IndianRupee} date={formattedDate} amount={maxSpentCategory.total} subtext={maxSpentCategory.category} />
          <InfoCard title="Miscellaneous" icon={IndianRupee} date={formattedDate} amount={miscellaneousSpent.amount} subtext={miscellaneousSpent.comparison} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-3">
          <CustomCard cardTitle="Monthly Spend" cardFooter="This is the graphical representation of Monthly spend" cardContent={<PieChartMonthly data={pieChartMonthlyData} />} />
          <CustomCard cardTitle="Total Spent" cardFooter="This is the graphical representation of Total spend" cardContent={<IndianRupee />} />
        </div>

      </div>
  );
};

export default Homepage;
