<?php
// register.php
session_start();
require 'db.php';

$message = "";
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim($_POST['email']);
    $password = $_POST['password'];

    // Check if email already exists
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        $message = "Email already taken. Please choose another.";
    } else {
        // Hash the password
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        // Insert new user
        $stmt = $pdo->prepare("INSERT INTO users (email, password) VALUES (?, ?)");
        if ($stmt->execute([$email, $hashedPassword])) {
            $message = "Registration successful. You can now <a href='login.php'>login</a>.";
        } else {
            $message = "Error creating account.";
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Register - JobX</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="style.css" />
  </head>
  <body class="bg-cover bg-center" style="background-image: url('Assets/Emerald.jpg');">
    <div class="flex items-center justify-center h-screen">
      <div class="bg-gray-800 bg-opacity-75 p-8 rounded-lg shadow-lg max-w-sm w-full">
        <div class="flex justify-center mb-4">
          <img src="Assets/JobX Logo.png" alt="JobX Logo" class="w-32 h-auto" />
        </div>
        <h2 class="text-2xl text-center text-white font-bold mb-6">Create Your Account</h2>
        <?php if ($message): ?>
          <p class="text-center <?php echo strpos($message, 'successful') !== false ? 'text-green-500' : 'text-red-500'; ?> mb-4">
            <?php echo $message; ?>
          </p>
        <?php endif; ?>
        <form action="register.php" method="POST" id="registerForm">
          <div class="mb-4">
            <label for="registerEmail" class="block text-gray-300 mb-2">Email</label>
            <input type="email" id="registerEmail" name="email" placeholder="you@example.com" class="w-full px-3 py-2 rounded-md border border-gray-600 bg-gray-700 text-white" required>
          </div>
          <div class="mb-6">
            <label for="registerPassword" class="block text-gray-300 mb-2">Password</label>
            <input type="password" id="registerPassword" name="password" placeholder="Your password" class="w-full px-3 py-2 rounded-md border border-gray-600 bg-gray-700 text-white" required>
          </div>
          <button type="submit" class="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-md">Register</button>
        </form>
        <p class="mt-4 text-center text-gray-300">
          Already have an account? <a href="login.php" class="text-blue-400 hover:underline">Login here</a>
        </p>
      </div>
    </div>
  </body>
</html>
