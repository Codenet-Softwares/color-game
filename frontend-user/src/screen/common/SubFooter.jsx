import React, { useEffect, useState } from "react";
import { getInnerAnnouncement } from "../../utils/apiService";

const SubFooter = () => {
    const [announcementData, setAnnouncementData] = useState([]);

    const fetchAnnouncement = async () => {
        try {
            const response = await getInnerAnnouncement();
            if (response && response.data) {
                setAnnouncementData(response.data);
            } else {
                console.error("Error fetching announcements", response);
                setAnnouncementData([]);
            }
        } catch (error) {
            console.error("Error fetching announcements", error);
            setAnnouncementData([]);
        }
    };

    useEffect(() => {
        fetchAnnouncement();
    }, []);

    return (
        <nav
            className="navbar p-1"
            style={{
                background: "linear-gradient(to bottom, #18ADC5,rgb(63, 125, 139))",
                color: "white",
               
                alignItems: "center",
                overflow: "hidden",
            }}
        >
            <div style={{ width: "100%", overflow: "hidden" }}>
                {announcementData.length > 0 ? (
                    <marquee
                        style={{
                            color: "white",
                            fontSize: "14px",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {announcementData.map((item) => (
                            <span key={item.id} style={{ marginRight: "20px" }}>
                                {item.announcement}
                            </span>
                        ))}
                    </marquee>
                ) : (
                    <p
                        style={{
                            color: "white",
                            textAlign: "center",
                            margin: 0,
                            fontSize: "14px",
                        }}
                    >
                        No announcements available.
                    </p>
                )}
            </div>
        </nav>
    );
};

export default SubFooter;
