import React from "react";
import { Table, Badge, Card, CardBody, Row, Col } from "reactstrap";

const TimeSlotView = ({
    timeSlots = [],
    title = "Time Slots",
    showType = true,
    showStatus = true,
    className = ""
}) => {
    if (!timeSlots || timeSlots.length === 0) {
        return (
            <div className={`time-slot-container ${className}`}>
                <h6 className="mb-3">{title}</h6>
                <div className="text-center text-muted py-3">
                    <i className="bx bx-time font-size-24 mb-2"></i>
                    <p>No time slots available</p>
                </div>
            </div>
        );
    }

    // Get all unique time slot types
    const slotTypes = [...new Set(timeSlots.map(slot => slot.timeSlotType))];

    return (
        <div className={`time-slot-container ${className}`}>
            <h6 className="mb-3">{title}</h6>

            {slotTypes.map((slotType, typeIndex) => {
                const slotData = timeSlots.find(slot => slot.timeSlotType === slotType);

                if (!slotData || !slotData.dayWiseSlots) {
                    return null;
                }

                const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                const hasAnySlots = slotData.dayWiseSlots.some(day =>
                    day.timeSlots && day.timeSlots.length > 0
                );

                return (
                    <Card key={`${slotType}-${typeIndex}`} className="mb-3">
                        <CardBody>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h6 className="mb-0 text-capitalize">
                                    {slotType.replace(/([A-Z])/g, ' $1').trim()}
                                </h6>
                                {showStatus && (
                                    <Badge
                                        color={slotData.isActive ? "success" : "secondary"}
                                        className="text-capitalize"
                                    >
                                        {slotData.isActive ? "Active" : "Inactive"}
                                    </Badge>
                                )}
                            </div>

                            {hasAnySlots ? (
                                <div className="row">
                                    {daysOfWeek.map(day => {
                                        const daySlot = slotData.dayWiseSlots.find(d => d.day === day);
                                        const hasSlots = daySlot && daySlot.timeSlots && daySlot.timeSlots.length > 0;

                                        return (
                                            <Col key={day} xs={12} sm={6} md={4} lg={3} className="mb-2">
                                                <div className={`day-slot-card p-2 border rounded ${hasSlots ? 'border-success' : 'border-light'}`}>
                                                    <div className="d-flex justify-content-between align-items-center mb-1">
                                                        <strong className="text-capitalize">{day}</strong>
                                                        {/* {showStatus && daySlot && (
                                                            <Badge
                                                                color={daySlot.isOpen ? "success" : "secondary"}
                                                                size="sm"
                                                            >
                                                                {daySlot.isOpen ? "Open" : "Closed"}
                                                            </Badge>
                                                        )} */}
                                                    </div>

                                                    {hasSlots ? (
                                                        <div className="time-slots-list">
                                                            {daySlot.timeSlots
                                                                .sort((a, b) => a.localeCompare(b))
                                                                .map((time, index) => (
                                                                    <span
                                                                        key={index}
                                                                        className="badge bg-light text-dark me-1 mb-1"
                                                                    >
                                                                        {time}
                                                                    </span>
                                                                ))
                                                            }
                                                        </div>
                                                    ) : (
                                                        <small className="text-muted">No slots</small>
                                                    )}
                                                </div>
                                            </Col>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center text-muted py-3">
                                    <i className="bx bx-time font-size-18 mb-2"></i>
                                    <p className="mb-0">No time slots available for this type</p>
                                </div>
                            )}
                        </CardBody>
                    </Card>
                );
            })}
        </div>
    );
};

export default TimeSlotView; 