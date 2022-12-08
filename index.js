const express = require('express')
const app = express()
const port = process.env.PORT || 8000

const CryptoJS = require("crypto-js")
const cors = require('cors');
const corsOptions = {
    origin: '*',
    preflightContinue:false,
    credentials: true,
};
app.use(cors(corsOptions));

// import models
const Student = require('./models/Student')
const Learning = require('./models/LearningResources')
const User = require('./models/User')
const CliImgAsset = require('./models/CliImgAsset')

const mongoose = require('mongoose')
const mongoAtlasUri = 'mongodb+srv://sanookkit_admin:SanookKitAdmin@sanookkit.0n6rtvm.mongodb.net/sanookkit?retryWrites=true&w=majority'
// const mongoAtlasUri = 'mongodb+srv://dbAdmin:admin1234@sanookit.g5spwuu.mongodb.net/sanookkit?retryWrites=true&w=majority';

// Connect to the MongoDB cluster
mongoose.connect(mongoAtlasUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
    console.log('monogodb connected')
})


app.use(express.json())


app.get('/test', async (req, res) => {
    res.json({
        message: "start new project"
    });
})

const scrkey = "sanookkitToken"

// student
app.get('/student', async (req, res) => {
    const students = await Student.find();
    res.json(students);
})

app.post('/student', async (req, res) => {
    const payload = req.body;
    const students = new Student(payload);
    await students.save();
    res.status(201).end();
})

app.post('/studentList', async (req, res) => {
    const payload = req.body;
    const students = new Student(payload);

    Student.insertMany(payload, function (err, docs) {
        if (err){ 
            res.json({
                message: err
            })
        } else {
          console.log("Multiple documents inserted to Collection");
          res.status(201).json(payload);
        }
    });
})

app.patch('/student/:id', async (req, res) => {
    const payload = req.body;
    const { id } = req.params;

    const student = await Student.findByIdAndUpdate(id, { $set: payload });
    res.json(student);
});

app.patch('/allStudent', async (req, res) => {
    var students = await Student.find();
    students.forEach((student) => {
        if ((parseInt(student.bag_id) >= 1011 && parseInt(student.bag_id) <= 1030) ||
        (parseInt(student.bag_id) >= 2011 && parseInt(student.bag_id) <= 2030) ||
        (parseInt(student.bag_id) >= 3018 && parseInt(student.bag_id) <= 3037) ||
        (parseInt(student.bag_id) >= 4011 && parseInt(student.bag_id) <= 4030) ||
        (parseInt(student.bag_id) >= 5015 && parseInt(student.bag_id) <= 5034) ||
        (parseInt(student.bag_id) >= 6011 && parseInt(student.bag_id) <= 6030)) {
            student.school = "โรงเรียนบ้านดู่"
            // student.address.city = student.address.city.search('จังหวัด') != -1 ? student.address.city.substring(7) : student.address.city
            Student.findByIdAndUpdate(student._id, { $set: student });
        }
        // const studentUp = Student.findByIdAndUpdate(student._id, { $set: student });
    })
    // await students.save();
    res.json(students);
});

app.delete('/student/:id', async (req, res) => {
    const { id } = req.params;

    await Student.findByIdAndDelete(id);
    res.status(204).end();
});

// learning
app.get('/learning-resource', async (req, res) => {
    const learning = await Learning.find();
    res.json(learning);
})

app.post('/learning-resource', async (req, res) => {

    const payload = req.body;
    const learning = new Learning(payload);
    await learning.save();
    console.log('test', payload)
    res.json({
        data: learning,
    })
});

app.delete('/learning-resource/:id', async (req, res) => {
    const { id } = req.params;
    const learningData = await Learning.findById(id)
    try {
      await Learning.findByIdAndDelete(id);  
    } catch (err) {
        res.json({
            err_message: err
        })
    }
    res.json(learningData)
});

//  user
app.get('/user', async (req, res) => {
    console.log(req.header('access_token'))
    const userList = await User.find();
    res.json(userList);
})

app.post('/user', async (req, res) => {
    const payload = req.body;
    const users = new User(payload);
    await users.save();
    res.status(204).end();
})

app.delete('/user/:id', async (req, res) => {
    const { id } = req.params;

    await User.findByIdAndDelete(id);
    res.status(204).end();
});

app.post('/signin', async (req, res) => {
    const payload = req.body;
    const authUser = new User(payload);
        const authedUser = await User.findOne({ username: authUser.username });
        if (authedUser) {

            const authedPass = decrypt(authedUser.password)
            const authPass = decrypt(authUser.password)
            const isCorrectPass = authPass.includes(authedPass)
            if (isCorrectPass) {
                // const cd = new Date().toLocaleString('en-US', {
                //     timeZone,
                //   })
                const token = {
                    username: authedUser.username,
                    role: authedUser.role,
                    timestamp: currentDate()
                }
                res.json({
                    token: encrypt(JSON.stringify(token))
                })
            } else {
                res.json({
                    message: 'incorrect password'
                })
            }
        } else {
            res.json({
                message: "user not found"
            })
        }
        
})

app.get('/cliImgAsset', async (req, res) => {
    try {
        const cliImgAsset = await CliImgAsset.find();
        res.status(200).json(cliImgAsset)
    } catch(err) {
        res.status(404).json({
            err: err
        })
    }
})

app.post('/cliImgAsset', async (req, res) => {
    const payload = req.body;
    try {
        CliImgAsset.insertMany(payload, {ordered : false })
        res.json(payload)
    } catch(err) {
        res.json({
            err: err
        })
    }
})

app.delete('/cliImgAsset/:id', async (req, res) => {
    const { id } = req.params;
    const cliImgAssetData = await CliImgAsset.findById(id)
    try {
      await CliImgAsset.findByIdAndDelete(id);  
    } catch (err) {
        res.json({
            err_message: err
        })
    }
    res.json(cliImgAssetData)
});


const currentDate = () => {
    const today = new Date()
    const timezone = today.getTimezoneOffset() * -60
    return new Date(today.getTime() + timezone  * 60 * 60 * 1000)
}

const encrypt = (src) => {
    return CryptoJS.AES.encrypt(src, scrkey).toString()
}
const decrypt = (src) => {
    const bytes = CryptoJS.AES.decrypt(src, scrkey)
    const originalText = bytes.toString(CryptoJS.enc.Utf8)
    return originalText
}

app.listen(port, () => {
    console.log(`Express is working on port ${port}`);
  });

{/* <IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule> */}