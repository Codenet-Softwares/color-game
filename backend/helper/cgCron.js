import { db } from "../firebase-db.js";
import Market from "../models/market.model.js";
import { getISTTime } from "./commonMethods.js";

export async function updateColorGame() {
  const currentTime = getISTTime();

  try {
    const snapshot = await db.collection("color-game-db").get();

    if (!snapshot || !snapshot.docs || snapshot.docs.length === 0) {
      return;
    }

    snapshot.docs.forEach(async doc => {
      const data = doc.data();

      if(data.isMarketClosed) return;

      let startTime = data.startTime;
      let endTime = data.endTime;

      if (!startTime || !endTime) {
        return;
      }

      startTime = parseDate(startTime);
      endTime = parseDate(endTime);

      if (!startTime || !endTime || isNaN(startTime) || isNaN(endTime)) {
        return;
      }

      let updates = {};
      let shouldUpdate = false;

      if (currentTime >= startTime && currentTime <= endTime && !data.isActive) {
        updates.isActive = true;
        updates.hideMarketWithUser = true;
        updates.updatedAt = currentTime.toISOString();
        shouldUpdate = true;
        console.log("In", doc.id)
      }

      if (currentTime > endTime && data.isActive) {
        updates.isActive = false;
        updates.isMarketClosed = true;
        updates.updatedAt = currentTime.toISOString();
        shouldUpdate = true;
        console.log("OUT", doc.id)
      }

      if (shouldUpdate) {
        await db.collection("color-game-db").doc(doc.id).update(updates);
        console.log(`Updated color game with updates:`, doc.id);
        await Market.update(
          {
            isActive: updates.isActive ?? data.isActive,
            hideMarketWithUser: updates.hideMarketWithUser ?? data.hideMarketWithUser,
            updatedAt: currentTime.toISOString()
          },
          {
            where: { marketId: doc.id },
          }
        );

      }
    });
  } catch (error) {
    console.error("Error updating ColorGame:", error);
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
