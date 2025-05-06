import { Card, CardBody, CardFooter, CardHeader, Spinner } from "@heroui/react";

interface AppProps {
  cardTitle?: string | React.ReactNode;
  cardContent: React.ReactNode;
  cardFooter?: string;
  cardToggle?: React.ReactNode;
  loading?: boolean;
}

const CustomCard: React.FC<AppProps> = ({ cardTitle, cardContent, cardFooter, cardToggle, loading }) => {
  return (
    <Card className="w-full  h-auto flex flex-col justify-between">
      <CardHeader className="flex flex-col justify-between"> 
        <div>
          {typeof cardTitle === "string" ? <span>{cardTitle}</span> : cardTitle}
          
        </div>
      </CardHeader>
      <CardBody className="flex-grow flex justify-center items-center">
      {loading ? <Spinner size="lg" color="primary" /> : cardContent}
      </CardBody>
      <CardFooter className="text-gray-500">{cardFooter}</CardFooter>
    </Card>
  );
};

export default CustomCard;
