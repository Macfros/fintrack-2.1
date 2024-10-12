"use client";

import { User } from "next-auth";
import InfoCard from "@/app/components/HomePage/InfoCard";
import { IndianRupee } from "lucide-react";
import { useAppSelector } from "@/app/store/hooks";
import { MiscellaneousSpent, mostSpentCategory, selectCurrentMonthAmount, selectTotalAmount } from "@/app/store/slices/bill";

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
    <>
      <div>Hello {user?.name}!</div>

      <div className="flex flex-wrap gap-5">
        <InfoCard
          title="Total Spending"
          icon={IndianRupee}
          date={`till ${formattedDate}`}
          amount={totalAmount}
          subtext={comparisonSubtext}
        />

        <InfoCard
          title="Monthly Spending"
          icon={IndianRupee}
          date={monthName}
          amount={currentMonthAmount.amount}
          subtext={currentMonthAmount.comparison}
        />

        <InfoCard
          title="Most Spend"
          icon={IndianRupee}
          date={formattedDate}
          amount={maxSpentCategory.total}
          subtext={maxSpentCategory.category}
        />

        <InfoCard
          title="Miscellaneous"
          icon={IndianRupee}
          date={formattedDate}
          amount={miscellaneousSpent.amount}
          subtext={miscellaneousSpent.comparison}
        />
      </div>
    </>
  );
};

export default Homepage;
