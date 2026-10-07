const { Doctor, Patient } = require('./models');

async function seedDatabase() {
  if (await Doctor.count() === 0) {
    await Doctor.bulkCreate([
      { name: 'Dr. Anil Sharma', specialization: 'General Physician' },
      { name: 'Dr. Priya Mehta', specialization: 'Pediatrician' },
      { name: 'Dr. Rahul Verma', specialization: 'Orthopedic' },
    ]);
  }
  if (await Patient.count() === 0) {
    await Patient.bulkCreate([
      { name: 'Aarav Patel', gender: 'MALE', age: 32, phone: '9876543210' },
      { name: 'Neha Singh', gender: 'FEMALE', age: 28, phone: '9876543211' },
      { name: 'Kabir Khan', gender: 'MALE', age: 7, phone: '9876543212' },
    ]);
  }
}

module.exports = seedDatabase;
