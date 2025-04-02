import { db } from "../firebase-db.js";
import Market from "../models/market.model.js";
import { getISTTime } from "./commonMethods.js";

export async function updateColorGame() {
    const currentTime = getISTTime();

    try {
        const snapshot = await db.collection("color-game-db").get();

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
                return;
            }

            let updates = {};
            let shouldUpdate = false;
            if (currentTime >= startTime && currentTime <= endTime) {
                if (!data.isActive) {
                    updates.isActive = true;
                    updates.hideMarketUser = true;
                    updates.updatedAt = new Date().toISOString();
                    shouldUpdate = true;
                }
            } else if (currentTime >= endTime) {
                if (data.isActive) {
                    updates.isActive = false;
                    updates.updatedAt = new Date().toISOString();
                    shouldUpdate = true;
                }
            }

            if (shouldUpdate) {
                await db.collection("color-game-db").doc(doc.id).update(updates);

                await Market.update(
                    {
                        isActive: updates.isActive ?? data.isActive,
                        hideMarketUser: updates.hideMarketUser ?? data.hideMarketUser,
                        updatedAt: shouldUpdate ? new Date() : data.updatedAt
                    },
                    {
                        where: { marketId: doc.id },
                    }
                );
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
        return null;
    }
}

