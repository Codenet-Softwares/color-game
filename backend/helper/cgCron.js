import { db } from "../firebase-db.js";
import { getISTTime } from "./commonMethods.js";

export async function updateColorGame() {
    const currentTime = getISTTime(); 

    try {
        const snapshot = await db.collection("color-game").get();

        const updatePromises = snapshot.docs.map(async (doc) => {
            const data = doc.data();

            let startTime = data.startTime;
            let endTime = data.endTime;

            if (!startTime || !endTime) {
                console.warn(`Missing start_time or end_time for document: ${doc.id}`);
                return; 
            }

            startTime = parseDate(startTime);
            endTime = parseDate(endTime);

            if (!startTime || !endTime || isNaN(startTime) || isNaN(endTime)) {
                console.error(`Invalid date format for document: ${doc.id}`);
                return;
            }

            let updates = {};
            if (currentTime >= startTime && currentTime <= endTime && !data.isActive) {
                updates.isActive = true;
                updates.hideMarketUser = true;
            } else if (currentTime > endTime && data.isActive) {
                updates.isActive = false;
            }

            if (Object.keys(updates).length > 0) {
                await db.collection("color-game").doc(doc.id).update(updates);
            }
        });

        await Promise.all(updatePromises); 
    } catch (error) {
        console.error("Error updating Colorgame:", error);
    }
}

function parseDate(dateInput) {
    if (!dateInput) return null;
    if (typeof dateInput === "string") {
        const [datePart, timePart] = dateInput.split(" ");
        if (!datePart || !timePart) return null;
        return new Date(`${datePart}T${timePart}Z`);
    } else if (typeof dateInput === "number") {
        return new Date(dateInput);
    } else if (dateInput instanceof Date) {
        return dateInput;
    } else {
        console.error("Unknown date format:", dateInput);
        return null;
    }
}
