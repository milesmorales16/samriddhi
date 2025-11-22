---
description: Allow non-root users to run docker commands
---

1. Create the docker group (if it doesn't exist)
```bash
sudo groupadd docker
```

2. Add your user to the docker group.
```bash
sudo usermod -aG docker $USER
```

3. Activate the changes to groups.
```bash
newgrp docker
```

4. Verify that you can run docker commands without sudo.
```bash
docker run hello-world
```
