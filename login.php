<?php
// login.php
session_start();
require 'db.php';

$error = "";
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $email = trim($_POST['email']);
  $password = $_POST['password'];

  // Prepare and execute query to fetch user by email
  $stmt = $pdo->prepare("SELECT id, password FROM users WHERE email = ?");
  $stmt->execute([$email]);
  $user = $stmt->fetch();

  if ($user && password_verify($password, $user['password'])) {
    // Login successful; set session and redirect to main interface (index.html)
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['email'] = $email;
    header("Location: index.html");
    exit;
  } else {
    $error = "Invalid email or password";
  }
}
?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Login - JobX</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="style.css" />
  </head>
  <body class="bg-cover bg-center" style="background-image: url('Assets/Emerald.jpg');">
    <div class="flex items-center justify-center h-screen">
      <div class="bg-gray-800 bg-opacity-75 p-8 rounded-lg shadow-lg max-w-sm w-full">
        <div class="flex justify-center mb-4">
          <img src="Assets/JobX Logo.png" alt="JobX Logo" class="w-32 h-auto" />
        </div>
        <h2 class="text-2xl text-center text-white font-bold mb-6">Login to JobX</h2>
        <?php if ($error): ?>
          <p class="text-red-500 text-center mb-4"><?php echo $error; ?></p>
        <?php endif; ?>
        <form action="login.php" method="POST" id="loginForm">
          <div class="mb-4">
            <label for="loginEmail" class="block text-gray-300 mb-2">Email</label>
            <input type="email" id="loginEmail" name="email" placeholder="you@example.com" class="w-full px-3 py-2 rounded-md border border-gray-600 bg-gray-700 text-white" required>
          </div>
          <div class="mb-6">
            <label for="loginPassword" class="block text-gray-300 mb-2">Password</label>
            <input type="password" id="loginPassword" name="password" placeholder="Your password" class="w-full px-3 py-2 rounded-md border border-gray-600 bg-gray-700 text-white" required>
          </div>
          <button type="submit" class="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md">Login</button>
        </form>
        <p class="mt-4 text-center text-gray-300">
          Don't have an account? <a href="register.php" class="text-blue-400 hover:underline">Register here</a>
        </p>
      </div>
    </div>
  </body>
</html>
