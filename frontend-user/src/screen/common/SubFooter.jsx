import React, { useEffect, useState } from "react";
import { getInnerAnnouncement } from "../../utils/apiService";

const SubFooter = ({ isAnnnoucementUpadte }) => {
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
  }, [isAnnnoucementUpadte]);

  return (
    <nav
      className="navbar p-0 d-none d-md-block d-sm-none"
      style={{
        background: "#294253",
        color: "white",
        alignItems: "center",
        // height:"15px"
      }}
    >
      <div style={{ width: "100%", overflow: "hidden" }}>
        {announcementData.length > 0 ? (
          <marquee
            style={{
              color: "white",
              fontSize: "14px",
              whiteSpace: "nowrap",
              margin: "0",
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
              fontWeight: "bold",
            }}
          >
            No Announcements Available.
          </p>
        )}
      </div>
    </nav>
  );
};

export default SubFooter;
