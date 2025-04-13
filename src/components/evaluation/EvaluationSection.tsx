
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RatingSystem } from "./RatingSystem";
import { ReviewSystem } from "./ReviewSystem";
import { RewardSystem } from "./RewardSystem";

interface EvaluationSectionProps {
  userType: "propriétaire" | "cueilleur";
  userId?: string;
}

export function EvaluationSection({ userType, userId }: EvaluationSectionProps) {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="rating" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="rating">Évaluations</TabsTrigger>
          <TabsTrigger value="review">Commentaires</TabsTrigger>
          <TabsTrigger value="badges">Badges</TabsTrigger>
        </TabsList>
        
        <TabsContent value="rating" className="mt-4">
          <RatingSystem 
            type={userType} 
            onRatingSubmit={(ratings) => console.log("Ratings submitted:", ratings)}
          />
        </TabsContent>
        
        <TabsContent value="review" className="mt-4">
          <ReviewSystem 
            onReviewSubmit={(review) => console.log("Review submitted:", review)}
          />
        </TabsContent>
        
        <TabsContent value="badges" className="mt-4">
          <RewardSystem userType={userType} userId={userId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
