import { Card, CardBody, CardFooter, CardHeader } from "@heroui/react";

interface AppProps {
  cardTitle?: string | React.ReactNode;
  cardContent: React.ReactNode;
  cardFooter?: string;
  cardToggle?: React.ReactNode;
}

const CustomCard: React.FC<AppProps> = ({ cardTitle, cardContent, cardFooter, cardToggle }) => {
  return (
    <Card className="w-full  h-auto flex flex-col justify-between">
      <CardHeader className="flex flex-col justify-between"> 
      {typeof cardTitle === "string" ? <span>{cardTitle}</span> : cardTitle}
      {cardToggle && <div>{cardToggle}</div>} {/* ✅ Only render if provided */}
      </CardHeader>
      <CardBody className="flex-grow flex justify-center items-center">
        {cardContent}
      </CardBody>
      <CardFooter className="text-gray-500">{cardFooter}</CardFooter>
    </Card>
  );
};

export default CustomCard;
