let alert = require('alert');


// The main.js file of your application
module.exports = function (app) {
    // Home Page server-side functionality:
    app.get("/", function (req, res) {
        res.render("index.html")
    });

    // Add Device server-side functionality:
    app.get("/add_device", function (req, res) {
        res.render("add_device.html");
    });
    // POST endpoint which stores the device name, type and its corresponding initial status data in the database.
    app.post("/adddevice", function (req, res) {
        // saving data in database
        let sqlquery = "INSERT INTO devices (name, device_type, power, state, temperature, volume, brightness, power_use) VALUES (?,?,?,?,?,?,?,?)";
        let newrecord = [req.body.name, req.body.device_type, req.body.power, req.body.state, req.body.temperature,
        req.body.volume, req.body.brightness, req.body.power_use];
        // Data Sanitisation - Checks input if input is a number and alerts and redirects the user.
        if (isNaN(req.body.temperature) || isNaN(req.body.volume) || isNaN(req.body.brightness) || isNaN(req.body.power_use)) {
            alert("Please only insert a number input.");
            res.redirect("/add_device");
        }
        else {
            // If it is a number it will execute the sql query  
            db.query(sqlquery, newrecord, (err, result) => {
                if (err) {
                    return console.error(err.message);
                }
                else {
                    res.redirect('/device_status');
                }
            });
        }
    });

    // Device Status server-side functionality:
    app.get("/device_status", function (req, res) {
        // Query database to get all the devices
        let sqlquery = "SELECT * FROM devices";
        // Execute sql query
        db.query(sqlquery, (err, result) => {
            if (err) {
                res.redirect("/");
            }
            res.render("device_status.html", { allDevices: result });
        });
    });

    // Control Device server-side functionality:
    app.get("/control_device", function (req, res) {
        // Query database to get all the devices
        let sqlquery = "SELECT * FROM devices";
        // Execute sql query
        db.query(sqlquery, (err, result) => {
            if (err) {
                res.redirect("/");
            }
            res.render("control_device.html", { allDevices: result });
        });
    });
    app.get("/update_form", function (req, res) {
        // Searching in the database for device name
        let word = [req.query.keyword];
        let sqlquery = "SELECT * FROM devices WHERE name like ?";
        // Execute sql query
        db.query(sqlquery, word, (err, result) => {
            if (err) {
                return console.error("No device found with the keyword entered"
                    + req.query.keyword + "error: " + err.message);
            }
            else {
                res.render('device.html', { availableDevices: result });
            }
        });
    });
    app.post("/controldevice", function (req, res) {
        // Updating data in database
        let sqlquery = "UPDATE devices SET power = ?, state = ?, temperature = ?, volume = ?, brightness = ?, power_use = ? WHERE name = ?";
        // Execute sql query
        let newrecord = [req.body.power, req.body.state, req.body.temperature, req.body.volume, req.body.brightness, req.body.power_use, req.body.name];

        db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
                return console.error(err.message);
            }
            else {
                res.redirect('/device_status');
            }
        });
    });

    // Delete Device server-side functionality:
    app.get("/delete_device", function (req, res) {
        // Query database to get all devices
        let sqlquery = "SELECT * FROM devices";
        // Execute sql query
        db.query(sqlquery, (err, result) => {
            if (err) {
                res.redirect("/");
            }
            res.render("delete_device.html", { allDevices: result });
        });
    });
    app.post("/deletedevice", function (req, res) {
        // Deleting device data from database
        let sqlquery = " DELETE FROM devices WHERE name = ?";
        // Execute sql query
        let newrecord = [req.body.name];
        db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
                return console.error(err.message);
            }
            else {
                alert("Device has been Deleted Successfully")
                res.redirect('/delete_device');
            }
        });
    });


}   