import { updateGoogleRating } from "../helpers/vendorApi";
import { ShowToast } from "../components/Toast";

export const handleUpdateRating = async (id, rating, type) => {
    try {
        const response = await updateGoogleRating({
            id,
            rating,
            type
        });
        if (response.type === "success") {
            ShowToast.success("Rating updated successfully");
        } else {
            ShowToast.error("Failed to update Rating");
        }
    } catch (error) {
        ShowToast.error("something went wrong");
    }
}
