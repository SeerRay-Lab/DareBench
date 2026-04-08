mkdir -p project/{models,views,controllers}
echo "<?php
// File: index.php
require_once 'models/User.php';
require_once 'controllers/UserController.php';

// Bootstrap the application
echo 'Application started';
?>" > project/index.php

echo "<?php
// File: models/User.php
class User {
    private \$name;
    private \$email;

    public function __construct(\$name, \$email) {
        \$this->name = \$name;
        \$this->email = \$email;
    }

    // Getter and Setter
    public function getName() {
        return \$this->name;
    }

    public function getEmail() {
        return \$this->email;
    }
}
?>" > project/models/User.php

echo "<?php
// File: controllers/UserController.php
require_once 'models/User.php';

class UserController {
    public function createUser(\$name, \$email) {
        \$user = new User(\$name, \$email);
        // Save the user to a database (simulated)
        echo 'User ' . \$user->getName() . ' created successfully';
    }
}
?>" > project/controllers/UserController.php

echo "<?php
// File: views/home.php
?>
<!DOCTYPE html>
<html>
<head>
    <title>Home Page</title>
</head>
<body>
    <h1>Welcome to our application!</h1>
</body>
</html>
?>" > project/views/home.php