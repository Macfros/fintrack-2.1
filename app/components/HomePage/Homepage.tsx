import { User } from "next-auth";
import InfoCard from "@/app/components/HomePage/InfoCard";
import { IndianRupee } from "lucide-react";

interface AppProps {
  user: User;
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

  const totalAmount = 500; // TODO: Fetch from DB
  const comparisonSubtext = "50% more from last month"; // TODO: Fetch from DB
  const categoryName = "Food"; // TODO: Fetch from DB

  return (
    <>
      <div>Hello {user.name}!</div>

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
          amount={totalAmount}
          subtext={comparisonSubtext}
        />

        <InfoCard
          title="Most Spend"
          icon={IndianRupee}
          date={formattedDate}
          amount={totalAmount}
          subtext={categoryName}
        />

        <InfoCard
          title="Miscellaneous"
          icon={IndianRupee}
          date={formattedDate}
          amount={totalAmount}
          subtext={comparisonSubtext}
        />
      </div>
    </>
  );
};

export default Homepage;
