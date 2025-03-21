<?php
include 'db.php';

$action = $_GET['action'];

if ($action == "get") {
    $result = $conn->query("SELECT * FROM items");
    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
    echo json_encode($data);
}

if ($action == "add") {
    $name = $_POST['name'];
    $desc = $_POST['description'];
    $conn->query("INSERT INTO items (name, description) VALUES ('$name', '$desc')");
    echo "Data berhasil ditambahkan!";
}

if ($action == "delete") {
    $id = $_POST['id'];
    $conn->query("DELETE FROM items WHERE id='$id'");
    echo "Data berhasil dihapus!";
}

if ($action == "update") {
    $id = $_POST['id'];
    $name = $_POST['name'];
    $desc = $_POST['description'];

    $sql = "UPDATE items SET name='$name', description='$desc' WHERE id='$id'";
    if ($conn->query($sql)) {
        echo "Data berhasil diperbarui!";
    } else {
        echo "Error: " . $conn->error;
    }
}

?>

