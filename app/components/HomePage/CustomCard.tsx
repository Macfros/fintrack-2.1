import { CardContent } from "@/components/ui/card";
import { Card, CardFooter, CardHeader } from "@nextui-org/react";

interface AppProps {
    cardTitle?: string,
    cardContent: any,
    cardFooter?: string
}

const CustomCard: React.FC<AppProps> = ({cardTitle,cardContent,cardFooter}) => {
 
  return (
    <Card className="w-full h-[200px] flex flex-col justify-between">
        <CardHeader>
            {cardTitle}
        </CardHeader>
        <CardContent>
            {cardContent}
        </CardContent>
        <CardFooter className="text-gray-500">
            {cardFooter}
        </CardFooter>
    </Card>
  );
}

export default CustomCard;