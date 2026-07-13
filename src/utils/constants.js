export const STATUS = {
    I: "inComplete",
    P: "pending",
    A: "approved",
    R: "rejected",
};
/*
export const BOOKING_STATUS = {
    P: "PENDING",
    A: "ACCEPTED",
    O: "ONGOING",
    C: "COMPLETED",
    CBU: "CANCELLED",  // CANCEL BY USER
    R: "REJECTED",
};
*/

export const BOOKING_STATUS = {
    unassigned: "unassigned",
    pending: "pending",
    accepted: "accepted",
    // ongoing: "ongoing",
    completed: "completed",
    cancelled: "cancelled",
    //cancelledbydeliverypartner: "cancelledbydeliverypartner",
    //cancelledbyrestaurant: "cancelledbyrestaurant",
    rejected: "rejected",
    processing: "processing",
    readytoship: "readytoship",
    //shipped: "shipped",
    //outfordelivery: "outfordelivery",
    delivered: "delivered",
    //arrived: "arrived",
};

export const COUPON_FOR = {
    "all_users": "ALL USERS",
    "single_user": "SINGLE USER",
};

export const CATEGORY_TYPES = {
    "1": "Notties Pantry",
    "2": "Food Delivery",
    "3": "Quick Commerce",
    "4": "B2B"
};

export const BOOKING_TYPE = {
    "sale": "SALE",
    "purchase": "PURCHASE",
    "admin": "ADMIN"
};

export const BOOKING_PAYMENT_STATUS = {
    "unpaid": "UNPAID",
    "paid": "PAID"
}

export const getStatusClass = (status) => {
    switch (status) {
        case BOOKING_STATUS.P:
            return "warning";    // PENDING
        case BOOKING_STATUS.A:
            return "info";    // ACCEPTED
        case BOOKING_STATUS.O:
            return "primary";    // ONGOING
        case BOOKING_STATUS.C:
            return "success";       // COMPLETED
        case BOOKING_STATUS.CBU:
            return "danger";  // CANCELLED BY USER
        case BOOKING_STATUS.R:
            return "danger";     // REJECTED
        case "sale":
            return "success";     // SALE
        case "purchase":
            return "info";     // PURCHASE
        case "admin":
            return "primary";     // ADMIN
        default:
            return "";
    }
};
