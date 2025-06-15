
import InteractiveMap from "./InteractiveMap";

interface MapViewProps {
  results: any[];
  filters: any;
}

const MapView = ({ results, filters }: MapViewProps) => {
  return <InteractiveMap results={results} filters={filters} />;
};

export default MapView;
