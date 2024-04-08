const express = require('express');
const router = express.Router();

const { eq, asc, and } = require("drizzle-orm");

const db = require("../dbConnect");
const {
  rooms,
  equipments,
  invoices,
  users,
  schedules,
  classes,
  trainers,
  member_schedule
} = require("../db/schema");

// get all rooms
router.get("/getAllRooms", async (req, res) => {
    const { roomid, status } = req.query;
    const { user } = req;
    if(user.role?.toLowerCase() != "admin"){
      res.status(401).send("Unauthorized access");
      return;
    }
    let conditions = [];
    if(roomid){
      conditions.push(eq(rooms.roomid, roomid));
    }
    if(status){
      conditions.push(eq(rooms.status, status));
    }
    let whereClause = conditions.length > 0 ? and(...conditions) : null;

    console.log(whereClause)

    const result = await db
      .select()
      .from(rooms)
      .where(whereClause)
      .orderBy(asc(rooms.roomid))
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
    const { roomid } = req.body;
    const { user } = req;
    if(user.role?.toLowerCase() != "admin"){
      res.status(401).send("Unauthorized access");
      return;
    }
    const result = await db
      .select()
      .from(equipments)
      // .where(eq(equipments.roomid, roomid))
      .orderBy(equipments.equipmentid, "ASC")
      .execute()
      .then((data) => {
        res.status(200).send(data);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("An error occurred while fetching equipments");
      });
})

router.put("/updateEquipmentStatus", async (req, res) => {
    const { equipmentid, status } = req.body;
    const { user } = req;

    if(user.role?.toLowerCase() != "admin"){
      res.status(401).send("Unauthorized access");
      return;
    }
    console.log(equipmentid, status);

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
  

// get all invoices
router.get("/getAllInvoices", async (req, res) => {
    const { memberid } = req.query;
    const { user } = req;
    if(user.role.toLowerCase() != "admin"){
      res.status(401).send("Unauthorized access");
      return;
    }
    const result = await db
      .select({
        invoiceid: invoices.invoiceid,
        memberid: invoices.memberid,
        scheduleid: invoices.scheduleid,
        paymentStatus: invoices.status,
        amount: invoices.amount,
        paymentDate: invoices.date,
        member_fname: users.f_name,
        member_lname: users.l_name,
        classid: schedules.classid,
        start_time: schedules.start_time,
        duration: schedules.duration,
        scheduleDate: schedules.date,
        scheduleStatus: schedules.status,        
        className: classes.name
      })
      .from(invoices)
      // .where(eq(invoices.memberid, memberid)) // filter specific member invoices later
      .innerJoin(users, eq(invoices.memberid, users.userid))
      .innerJoin(schedules, eq(invoices.scheduleid, schedules.scheduleid))
      .innerJoin(classes, eq(schedules.classid, classes.classid))
      .orderBy( asc(invoices.status), asc(invoices.invoiceid))
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
    const { roomid, scheduleid } = req.body;
    const { user } = req;
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
    const { equipmentid, status } = req.body;
    const { user } = req;
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

// update room status
router.put('/updateRoomStatus', async (req, res) => {
    const { roomid, status } = req.body;
    const { user } = req;
    if(user.role.toLowerCase() != "admin"){
      res.status(401).send("Unauthorized access");
      return;
    }
    const result = await db
      .update(rooms)
      .set({
        status: status
      })
      .where(eq(rooms.roomid, roomid))
      .execute()
      .then((data) => {
        res.status(200).send("Room status updated successfully");
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("An error occurred while updating room status");
      });
})

router.post('/refundInvoice', async (req, res) => {
    const { invoiceid } = req.body;
    const { user } = req;
    if(user.role.toLowerCase() != "admin"){
      res.status(401).send("Unauthorized access");
      return;
    }

    // get the invoice details
    const invoiceDetails = await db
      .select()
      .from(invoices)
      .where(eq(invoices.invoiceid, invoiceid))
      .execute()
      .then((response) => {
        return response[0];
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("An error occurred while fetching invoice details");
        return;
      });

      // check if invoice is already refunded
      if(invoiceDetails.status == "refunded"){
        res.status(400).send("Invoice is already refunded");
        return;
      }

      // check if the member of the invoice has the scheduleid in their schedule
      const memberSchedule = await db
        .select()
        .from(member_schedule)
        .where(and(eq(member_schedule.scheduleid, invoiceDetails.scheduleid), eq(member_schedule.memberid, invoiceDetails.memberid)))
        .execute()
        .then((data) => {
          return data[0];
        })
        .catch((err) => {
          console.log(err);
          res.status(500).send("An error occurred while fetching member schedule");
        });

    if(memberSchedule){
      res.status(400).send("Member hasn't cancelled the schedule, cannot refund invoice!");
      return;
    }
    else{

      const result = await db
        .update(invoices)
        .set({
          status: "refunded"
        })
        .where(eq(invoices.invoiceid, invoiceid))
        .execute()
        .then((data) => {
          res.status(200).send("Invoice refunded successfully");
          return;
        })
        .catch((err) => {
          console.log(err);
          res.status(500).send("An error occurred while refunding invoice");
          return;
        });
    }
})

module.exports = router;