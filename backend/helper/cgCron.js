import { db } from "../firebase-db.js";
import Market from "../models/market.model.js";
import { getISTTime } from "./commonMethods.js";

export async function updateColorGame() {
  const currentTime = getISTTime();

  try {
    const snapshot = await db.collection("color-game-db").get();

    const updatePromises = snapshot.docs.map(async (doc) => {
      const data = doc.data();

      let startTime = parseDate(data.startTime);
      let endTime = parseDate(data.endTime);

      if (!startTime || !endTime || isNaN(startTime) || isNaN(endTime)) {
        console.warn(`Invalid or missing time for doc: ${doc.id}`);
        return;
      }

      let updates = {};
      let shouldUpdate = false;

       // Debugging log
       console.log(`Processing ${doc.id}`, {
        currentTime,
        startTime,
        endTime,
        isActive: data.isActive,
      });

      if (currentTime >= startTime && currentTime <= endTime && !data.isActive) {
        updates.isActive = true;
        console.log("first entry........................")
        updates.activeInactive = true;
        updates.updatedAt = new Date().toISOString();
        shouldUpdate = true;
      } else if (currentTime > endTime && data.isActive) {
        updates.isActive = false; 
        console.log("second entry........................")
        updates.updatedAt = new Date().toISOString();
        shouldUpdate = true;
      }

      if (shouldUpdate) {
        // Firestore update
        const firestoreUpdate = db.collection("color-game-db").doc(doc.id).update(updates);

        // MySQL update
        const mysqlUpdate = Market.update(
          {
            isActive: updates.isActive ?? data.isActive,
            activeInactive: updates.activeInactive ?? data.activeInactive,
            updatedAt: new Date(),
          },
          {
            where: { marketId: doc.id },
          }
        );

        await Promise.all([firestoreUpdate, mysqlUpdate]);
      }
    });

    // Wait for all updates to finish
    await Promise.all(updatePromises);

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


