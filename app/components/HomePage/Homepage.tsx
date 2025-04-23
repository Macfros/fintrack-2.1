"use client";

import React, { useEffect, useState, useMemo } from "react";
import InfoCard from "@/app/components/HomePage/InfoCard";
import { IndianRupee } from "lucide-react";
import { useAppSelector } from "@/app/store/hooks";
import {
  MiscellaneousSpentSelector,
  mostSpentCategorySelector,
  selectTotalAmountSelector,
  selectCurrentMonthAmountSelector,
  setBillSummary,
} from "@/app/store/slices/bill";
import CustomCard from "./CustomCard";
import { useDispatch } from "react-redux";
import PieChart from "../Charts/PieChart";
import toast from "react-hot-toast";
import BarGraph from "../Charts/BarGraph";

interface AppProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
}

const Homepage: React.FC<AppProps> = ({ user }) => {
  const dispatch = useDispatch();

  // Memoize the current date to avoid recreating it multiple times
  const date = useMemo(() => new Date(), []);
  const monthName = useMemo(
    () => date.toLocaleDateString("en-US", { month: "long" }),
    [date]
  );
  const formattedDate = useMemo(
    () =>
      date.toLocaleDateString("en-US", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    [date]
  );

  const [loading, setLoading] = useState(true);
  const [pieChartMonthlyData, setPieChartMonthlyData] = useState([]);
  const [pieChartYearlyData, setPieChartYearlyData] = useState([]);
  const [graphData, setGraphData] = useState([]);

  const fetchAllData = async () => {
    setLoading(true); // Start loading
    try {
     
      const [summaryRes, pieChartRes, graphRes] = await Promise.all([
        fetch("/api/BillActions/FetchBills/GetBillsSummary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user }),
        }),
        fetch("/api/Homepage/PieChart", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }),
        fetch("/api/Homepage/Graph", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }),
      ]);

      // Throw an error if any request fails
      if (!summaryRes.ok) throw new Error("Failed to fetch bills summary");
      if (!pieChartRes.ok) throw new Error("Failed to fetch pie chart data");
      if (!graphRes.ok) throw new Error("Failed to fetch graph data");

      const summaryData = await summaryRes.json();
      const pieChartData = await pieChartRes.json();
      const graphDataJson = await graphRes.json();

      dispatch(setBillSummary(summaryData.data));

      setPieChartMonthlyData(pieChartData.data.monthly || []);
      setPieChartYearlyData(pieChartData.data.yearly || []);
      setGraphData(graphDataJson.data || []);

      console.log("fetched data");
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Something went wrong while loading your dashboard");
    } finally {
      setLoading(false); // End loading
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [dispatch, user]);

  const totalAmount = useAppSelector(selectTotalAmountSelector);
  const currentMonthAmount = useAppSelector(selectCurrentMonthAmountSelector);
  const maxSpentCategory = useAppSelector(mostSpentCategorySelector);
  const miscellaneousSpent = useAppSelector(MiscellaneousSpentSelector);

  // TODO: Fetch the comparison from the database; currently hardcoded.
  const comparisonSubtext = "50% more from last month";

  return (
    <div className="w-full flex flex-col p-5 gap-5">
      <div className="text-l">Hello {user?.name}!</div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full">
        <InfoCard
          title="Total Spending"
          icon={IndianRupee}
          date={`till ${formattedDate}`}
          amount={totalAmount}
          subtext={comparisonSubtext}
          loading={loading}
        />
        <InfoCard
          title="Monthly Spending"
          icon={IndianRupee}
          date={monthName}
          amount={currentMonthAmount.amount}
          subtext={currentMonthAmount.comparison}
          loading={loading}
        />
        <InfoCard
          title="Most Spend"
          icon={IndianRupee}
          date={formattedDate}
          amount={maxSpentCategory.total}
          subtext={maxSpentCategory.category}
          loading={loading}
        />
        <InfoCard
          title="Miscellaneous"
          icon={IndianRupee}
          date={formattedDate}
          amount={miscellaneousSpent.amount}
          subtext={miscellaneousSpent.comparison}
          loading={loading}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-3">
        <CustomCard
          cardTitle={
            <>
              Total Spent - <b>{monthName} {date.getFullYear()}</b>
            </>
          }
          loading={loading}
          cardFooter="This is the graphical representation of Total spend"
          cardContent={<PieChart data={pieChartMonthlyData} />}
        />
        <CustomCard
          cardTitle={
            <>
              Total Spent - <b>{date.getFullYear()}</b>
            </>
          }
          loading={loading}
          cardFooter="This is the graphical representation of Total spend"
          cardContent={<PieChart data={pieChartYearlyData} />}
        />
      </div>

      <div>
        <CustomCard
          cardTitle={
            <>
              Year <b>{date.getFullYear()}</b>
            </>
          }
          loading={loading}
          cardFooter=""
          cardContent={<BarGraph data={graphData} />}
        />
      </div>
    </div>
  );
};

export default Homepage;
