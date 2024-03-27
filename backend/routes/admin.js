const express = require('express');
const router = express.Router();

const { eq } = require("drizzle-orm");

const db = require("../dbConnect");
const {
  rooms,
  equipments,
  invoices,
} = require("../db/schema");

// get all rooms
router.get("/getAllRooms", async (req, res) => {
    const { user } = req.user;
    if(user.role != "admin"){
      res.status(401).send("Unauthorized access");
      return;
    }
    const result = await db
      .select()
      .from(rooms)
      .execute()
      .then((data) => {
        res.status(200).send(data);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("An error occurred while fetching rooms");
      });
})
  
router.get("/getAllEquipments", async (req, res) => {
    const { roomid } = req.query;
    const { user } = req.user;
    if(user.role != "admin"){
      res.status(401).send("Unauthorized access");
      return;
    }
    const result = await db
      .select()
      .from(equipments)
      .where(eq(equipments.roomid, roomid))
      .execute()
      .then((data) => {
        res.status(200).send(data);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("An error occurred while fetching equipments");
      });
})
  

// get all invoices
router.get("/getAllInvoices", async (req, res) => {
    const { memberid } = req.query;
    const { user } = req.user;
    if(user.role != "admin"){
      res.status(401).send("Unauthorized access");
      return;
    }
    const result = await db
      .select()
      .from(invoices)
      // .where(eq(invoices.memberid, memberid)) // filter specific member invoices later
      .execute()
      .then((data) => {
        res.status(200).send(data);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("An error occurred while fetching invoices");
      });
})
  
// update the room for a schedule
router.put("/updateRoom", async (req, res) => {
    const { roomid, scheduleid } = req.query;
    const { user } = req.user;
    if(user.role != "admin"){
      res.status(401).send("Unauthorized access");
      return;
    }
    const result = await db
      .update(schedules)
      .set({
        roomid: roomid
      })
      .execute()
      .then((data) => {
        res.status(200).send("Room updated successfully");
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("An error occurred while updating room");
      });
})

//update equipment status
router.put('/updateEquipmentStatus', async (req, res) => {
    const { equipmentid, status } = req.query;
    const { user } = req.user;
    if(user.role != "admin"){
      res.status(401).send("Unauthorized access");
      return;
    }
    const result = await db
      .update(equipments)
      .set({
        status: status
      })
      .where(eq(equipments.equipmentid, equipmentid))
      .execute()
      .then((data) => {
        res.status(200).send("Equipment status updated successfully");
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("An error occurred while updating equipment status");
      });
})

module.exports = router;