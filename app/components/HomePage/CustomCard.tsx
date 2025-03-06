import { Card, CardBody, CardFooter, CardHeader } from "@heroui/react";

interface AppProps {
  cardTitle?: string;
  cardContent: React.ReactNode;
  cardFooter?: string;
}

const CustomCard: React.FC<AppProps> = ({ cardTitle, cardContent, cardFooter }) => {
  return (
    <Card className="w-full h-[300px] flex flex-col justify-between">
      <CardHeader>{cardTitle}</CardHeader>
      <CardBody className="flex-grow flex justify-center items-center">
        {cardContent}
      </CardBody>
      <CardFooter className="text-gray-500">{cardFooter}</CardFooter>
    </Card>
  );
};

export default CustomCard;
