import { Card, CardHeader, CardBody, CardFooter, Divider } from "@heroui/react";
import React from "react";
import { LucideIcon, IndianRupee } from "lucide-react";

interface AppProps {
  title: string;
  icon: LucideIcon;
  date?: string;
  amount: number;
  subtext?: string;
}

const InfoCard: React.FC<AppProps> = ({ title, icon: Icon, date, amount, subtext }) => {
  // Function to format amount in Indian currency style
  const formatAmount = (num: number) => {
    return new Intl.NumberFormat("en-IN").format(num);
  };

  return (
    <Card className="w-full h-[200px] flex flex-col justify-between">
      <CardHeader className="flex gap-3 justify-between">
        <div className="flex flex-col">
          <p className="text-md">{title}</p>
          <p className="text-small text-default-500">{date}</p>
        </div>
        <Icon className="w-50" />
      </CardHeader>
      <Divider />
      <CardBody className="flex flex-row text-5xl">
        <p><IndianRupee /></p>
        {/* Apply the format function here */}
        <p>{formatAmount(amount)}</p>
      </CardBody>
      <Divider />
      <CardFooter className="text-gray-500">
        {subtext}
      </CardFooter>
    </Card>
  );
}

export default InfoCard;
