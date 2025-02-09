"use client";

import { User } from "next-auth";
import InfoCard from "@/app/components/HomePage/InfoCard";
import { IndianRupee } from "lucide-react";
import { useAppSelector } from "@/app/store/hooks";
import { MiscellaneousSpent, mostSpentCategory, selectCurrentMonthAmount, selectTotalAmount, setBills } from "@/app/store/slices/bill";
import CustomCard from "./CustomCard";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";

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
  const [spendingData, setSpendingData] = useState();

  const dispatch = useDispatch(); // ✅ Hook inside component

  useEffect(() => {
    const fetchSpendingSummary = async () => {
      try {
        const response = await fetch('/api/BillActions/FetchBills/GetBillsSummary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user }),
        });

        if (!response.ok) throw new Error("Failed to fetch bills");

        const data = await response.json();
        console.log("Fetched spending summary:", data);

        setSpendingData(data);
        // 
      } catch (error) {
        console.error("Error fetching spending summary:", error);
      }
    };

    fetchSpendingSummary();
  }, [dispatch]); // ✅ Dependencies

  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'short', // "Sat"
    day: '2-digit', // "03"
    month: 'short', // "Aug"
    year: 'numeric', // "2024"
  });


  const totalAmount =  useAppSelector(selectTotalAmount); // TODO: Fetch from DB
  const currentMonthAmount  = useAppSelector(selectCurrentMonthAmount);
  const maxSpentCategory = useAppSelector(mostSpentCategory);
  const miscellaneousSpent = useAppSelector(MiscellaneousSpent);
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
          <CustomCard cardTitle="Monthly Spend" cardFooter="This is the graphical representation of Monthly spend" cardContent={<IndianRupee />} />
          <CustomCard cardTitle="Total Spent" cardFooter="This is the graphical representation of Total spend" cardContent={<IndianRupee />} />
        </div>
      </div>
  );
};

export default Homepage;
