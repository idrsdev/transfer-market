# **SSH Access Setup on DigitalOcean**

This guide will walk you through the steps to securely set up SSH access for your DigitalOcean server, generate SSH key pairs, and configure key-based authentication to secure your server.

---

## **1️⃣ Generate SSH Key Pair**

Start by generating an SSH key pair on your local machine (if you don't already have one). Use the following command to create a new SSH key:

```bash
ssh-keygen -t rsa -b 4096 -C "<email/comment>" -f ~/.ssh/id_rsa_digitalocean_dev
```

- `-t rsa`: Specifies the RSA algorithm for key generation.
- `-b 4096`: Sets the key length to 4096 bits for stronger encryption.
- `-C "<email/comment>"`: Adds a comment to identify the key.
- `-f ~/.ssh/id_rsa_digitalocean_dev`: Specifies the file path for saving the private key.

You will be prompted to enter a passphrase (optional but recommended for added security).

---

## **2️⃣ Copy Your Public Key to the Server**

To securely access your server using the SSH key, you need to copy the public key to your server. You can use `ssh-copy-id` to do this:

```bash
ssh-copy-id -i ~/.ssh/id_rsa_digitalocean_dev.pub root@your_server_ip
```

If `ssh-copy-id` is unavailable, you can manually copy the key by using the following commands:

```bash
cat ~/.ssh/id_rsa_digitalocean_dev.pub | ssh root@your_server_ip "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
```

---

## **3️⃣ Set Permissions on the Server**

Once the key is copied, you need to ensure that the correct permissions are set for the `.ssh` directory and `authorized_keys` file on your server:

```bash
ssh root@your_server_ip "chmod 700 ~/.ssh && chmod 600 ~/.ssh/authorized_keys"
```

This ensures that the `.ssh` directory is only accessible by the owner, and the `authorized_keys` file is only readable by the owner.

---

## **4️⃣ Add Your Private Key to SSH Agent**

To make the authentication process easier, you can add your private key to the SSH agent:

```bash
ssh-add ~/.ssh/id_rsa_digitalocean_dev
```

If you're using an Ed25519 key, the command would be:

```bash
ssh-add ~/.ssh/id_ed25519_digitalocean_dev
```

To verify that the key has been added:

```bash
ssh-add -l
```

---

## **5️⃣ Set Up SSH Config for Easier Access**

You can simplify the SSH login process by creating an entry in your `~/.ssh/config` file, so you don't need to type the full command every time. Edit (or create) the `config` file:

```bash
nano ~/.ssh/config
```

Add the following content to the file:

```plaintext
Host digitalocean
    HostName your_server_ip
    User root
    IdentityFile ~/.ssh/id_rsa_digitalocean_dev
```

This allows you to connect to the server with the following command:

```bash
ssh digitalocean
```

---

## **6️⃣ Test SSH Login**

Now, you can test the SSH login with the following command:

```bash
ssh digitalocean
```

This will use the SSH key for authentication, and you should be logged in to your server without needing to enter a password.

---

## **7️⃣ Secure SSH Access: Disable Password Authentication and Root Login**

Once SSH key-based authentication is working, it's time to improve security by disabling password authentication and restricting root login over SSH.

### **Edit SSH Configuration File:**

Open the SSH configuration file for editing:

```bash
sudo nano /etc/ssh/sshd_config
```

Make the following changes:

```plaintext
PasswordAuthentication no
PermitRootLogin no
```

- `PasswordAuthentication no`: Disables password-based authentication.
- `PermitRootLogin no`: Disables root login over SSH.

Save the file and exit (`CTRL + X`, then `Y` and `Enter`).

---

## **8️⃣ Restart SSH Service**

After making the changes to the SSH configuration, restart the SSH service for the changes to take effect:

```bash
sudo systemctl restart ssh
```

---

## **9️⃣ Verify SSH Login**

Finally, verify that you can still log in with the non-root user and SSH key. Attempt logging in with the following:

```bash
ssh myuser@your_server_ip
```

Ensure you can access your server. If successful, you've properly configured SSH access using keys and secured your server.

---

## **Final Notes**

- **Disabling password authentication and root login** significantly improves the security of your server by preventing brute force attacks and unauthorized root access.
- **Ensure that a non-root user with `sudo` privileges exists** and can log in with SSH keys before disabling root access.
- **Always keep the DigitalOcean console as a fallback** for emergency access if needed.

By following these steps, you will have a secure SSH setup for your DigitalOcean droplet. Happy deploying! 🚀
