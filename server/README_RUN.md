# HealthSync Backend Run & Troubleshoot Guide

This document outlines how to resolve Java class version mismatches, Maven path problems, and network-related Maven dependency download errors on Windows.

---

## 1. Upgrade to JDK 17 (Required)
The project code is built for Spring Boot 3.x, which requires **Java 17 or higher**. Running it on Java 8 triggers:
`UnsupportedClassVersionError: ... (class file version 61.0, runtime only recognizes up to 52.0)`

### Steps to Install JDK 17 on Windows:
1. Download the **JDK 17 Installer** from [Oracle's Java Downloads](https://www.oracle.com/java/technologies/downloads/#java17) or [Adoptium Temurin 17](https://adoptium.net/temurin/releases/?version=17).
2. Run the installer and complete the wizard.
3. Open Windows Environment Variables (`Win + S` -> search "env").
4. Under **System Variables**:
   - Add/Edit `JAVA_HOME` pointing to your JDK directory (e.g., `C:\Program Files\Eclipse Adoptium\jdk-17.0.x.x` or `C:\Program Files\Java\jdk-17`).
   - Find `Path` in System Variables, click Edit, and add `%JAVA_HOME%\bin` to the top of the list.
5. Close all terminals, open a new PowerShell/CMD, and run:
   ```powershell
   java -version
   javac -version
   ```
   *Verify it output version 17.x.x.*

---

## 2. Running without Maven installed (using Wrapper)
We have added the Maven wrapper script so you do not need to install Maven globally on your system.
Run the server using:
```powershell
cd D:\project\healthsync\server
.\mvnw.cmd spring-boot:run
```

---

## 3. Resolving Maven Dependency Download Errors (`UnknownHostException: repo.maven.apache.org`)
If your workspace is behind a proxy, firewall, or having local DNS resolution blocks:

1. **Flush Local DNS Resolver Cache**:
   Open PowerShell as Admin and run:
   ```powershell
   ipconfig /flushdns
   ```
2. **Switch to Public DNS**:
   If your network's default ISP DNS blocks Apache Maven repositories, configure your network adapter to use Google DNS:
   - **Primary DNS**: `8.8.8.8`
   - **Secondary DNS**: `8.8.4.4`
3. **Clean Corrupted Cache Directories**:
   If a download is interrupted, Maven keeps a `.lastUpdated` file blocking future attempts. Run this in PowerShell to clean it:
   ```powershell
   # Delete corrupted artifacts
   Get-ChildItem -Path "$env:USERPROFILE\.m2\repository" -Recurse -Filter "*.lastUpdated" | Remove-Item -Force
   ```
4. **Offline Mode or Re-attempt**:
   After resolving DNS, force Maven to fetch latest dependencies:
   ```powershell
   .\mvnw.cmd clean install -U
   ```
