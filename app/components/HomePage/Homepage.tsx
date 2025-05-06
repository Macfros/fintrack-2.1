"use client";

import React, { useEffect, useState, useMemo } from "react";
import InfoCard from "@/app/components/homePage/InfoCard";
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
import PieChart from "../charts/PieChart";
import toast from "react-hot-toast";
import BarGraph from "../charts/BarGraph";
import { useDispatch } from "react-redux";
import {
  useGetBarGraphMutation,
  useGetBillSummaryQuery,
  useGetPieChartMonthlyMutation,
  useGetPieChartYearlyMutation,
} from "@/app/store/api/stats.api"; // ✅ New import for RTK mutation hooks
import { BarGraphResponse } from "@/app/models/Models";

interface AppProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
}

const Homepage: React.FC<AppProps> = ({ user }) => {
  const dispatch = useDispatch();

  // Fetch spending summary via RTK Query
  const {
    data: summaryData,
    isLoading: summaryLoading,
    error: summaryError,
  } = useGetBillSummaryQuery();

  // Dispatch summary into Redux store when loaded
  useEffect(() => {
    if (summaryData) {
      dispatch(setBillSummary(summaryData));
    }
  }, [summaryData, dispatch]);

  // Local state for charts
  const [chartsLoading, setChartsLoading] = useState(true);
  const [pieChartMonthlyData, setPieChartMonthlyData] = useState<any[]>([]);
  const [pieChartYearlyData, setPieChartYearlyData] = useState<any[]>([]);
  const [graphData, setGraphData] = useState<BarGraphResponse>();


  const [getMonthly, { isLoading: loadingMonthly }] = useGetPieChartMonthlyMutation();
  const [getYearly, { isLoading: loadingYearly }] = useGetPieChartYearlyMutation();
  const [getBarGraphYearly, {isLoading: loadingBarYearly}] = useGetBarGraphMutation();

  // ✅ Fetch pie chart data via RTK Query instead of fetch()
  useEffect(() => {
    const fetchCharts = async () => {
      setChartsLoading(true);
      try {
        const month = new Date().getMonth();
        const year = new Date().getFullYear();

        const [monthlyRes, yearlyRes, barGraphData] = await Promise.all([
          getMonthly({ month, year }).unwrap(),
          getYearly({ year }).unwrap(),
          getBarGraphYearly({ year }).unwrap()
        ]);

        setPieChartMonthlyData(monthlyRes.monthly || []);
        setPieChartYearlyData(yearlyRes.yearly || []);
        setGraphData(barGraphData);

      } catch (err) {
        console.error("Error:",err);
        toast.error("Failed to load chart data");
      } finally {
        setChartsLoading(false);
      }
    };
    fetchCharts();
  }, [getMonthly, getYearly, getBarGraphYearly]);

  // Combined loading state
  const loading = summaryLoading || chartsLoading || loadingMonthly || loadingYearly;

  // Memoize date formatting
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

  // Redux selectors
  const totalAmount = useAppSelector(selectTotalAmountSelector);
  const currentMonthAmount = useAppSelector(selectCurrentMonthAmountSelector);
  const maxSpentCategory = useAppSelector(mostSpentCategorySelector);
  const miscellaneousSpent = useAppSelector(MiscellaneousSpentSelector);

  return (
    <div className="w-full flex flex-col p-5 gap-5">
      <div className="text-l">Hello {user?.name}!</div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full">
        <InfoCard
          title="Total Spending"
          icon={IndianRupee}
          date={`till ${formattedDate}`}
          amount={totalAmount}
          subtext={summaryData?.currentMonthAmount.comparison || ""}
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