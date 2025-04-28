const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const app = express();


app.use(cors());
app.use(bodyParser.json());


mongoose.connect('mongodb://127.0.0.1:27017/formdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));


const Form = require('./FormModel');


app.post('/submit-form', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const newForm = new Form({ name, email, message });
    await newForm.save();
    
    res.json({ message: 'Form submitted successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error submitting form' });
  }
});


app.get('/forms', async (req, res) => {
  try {
    const forms = await Form.find();
    res.json(forms);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching forms' });
  }
});


app.put('/forms/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, message } = req.body;

    const updatedForm = await Form.findByIdAndUpdate(id, { name, email, message }, { new: true });
    
    if (!updatedForm) {
      return res.status(404).json({ message: 'Form not found' });
    }

    res.json({ message: 'Form updated successfully!', updatedForm });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating form' });
  }
});


app.delete('/forms/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedForm = await Form.findByIdAndDelete(id);
    
    if (!deletedForm) {
      return res.status(404).json({ message: 'Form not found' });
    }

    res.json({ message: 'Form deleted successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting form' });
  }
});

// Server Start
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

