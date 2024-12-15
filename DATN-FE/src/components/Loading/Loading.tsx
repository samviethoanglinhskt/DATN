// LoadingOverlay.js
import { useLoading } from "src/context/LoadingContext";
import 'src/components/Loading/Loading.css'


const LoadingOverlay = () => {
    const { loading } = useLoading();

    if (!loading) return null;

    return (
        <div className="three-body">
            <div className="three-body__dot" />
            <div className="three-body__dot" />
            <div className="three-body__dot" />
        </div>

    );
};

export default LoadingOverlay;
