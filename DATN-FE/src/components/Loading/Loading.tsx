// LoadingOverlay.js
import { useLoading } from "src/context/LoadingContext";

const LoadingOverlay = () => {
    const { loading } = useLoading();

    if (!loading) return null;

    return (
        <div className="animsition-loading-1">
            <div className="loader05" />
        </div>
    );
};

export default LoadingOverlay;
