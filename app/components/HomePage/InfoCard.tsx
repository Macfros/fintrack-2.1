import { Card, CardHeader, CardBody, CardFooter, Divider, Spinner } from "@heroui/react";
import React from "react";
import { LucideIcon, IndianRupee } from "lucide-react";

interface AppProps {
  title: string;
  icon: LucideIcon;
  date?: string;
  amount: number;
  subtext?: string;
  loading?: boolean; 
}

const InfoCard: React.FC<AppProps> = ({ title, icon: Icon, date, amount, subtext, loading }) => {
  // Function to format amount in Indian currency style
  const formatAmount = (num: number) => {
    return new Intl.NumberFormat("en-IN").format(num);
  };

  return (
    <Card className="h-[200px] flex flex-col justify-between">
      <CardHeader className="flex gap-3 justify-between">
        <div className="flex flex-col">
          <p className="text-md">{title}</p>
          <p className="text-small text-default-500">{date}</p>
        </div>
        <Icon className="w-50" />
      </CardHeader>
      <Divider />
      <CardBody className="flex flex-row items-center gap-1 sm:text-3xl md:text-4xl">
      {loading ? (
          <Spinner size="lg" color="primary" />
        ) : (
          <div className="flex flex-row items-center gap-1 sm:text-2xl md:text-3xl">
            <p><IndianRupee /></p>
            <p>{formatAmount(amount)}</p>
          </div>
        )}
      </CardBody>
      <Divider />
      <CardFooter className="text-gray-500 sm:text-sm md:text-md">
        {subtext}
      </CardFooter>
    </Card>
  );
}

export default InfoCard;
