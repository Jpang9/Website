---
layout: post
title: "AsyncRat Analysis"
categories: blog malware analysis
excerpt_separator: <!-- excerpt_end -->
---
<!-- excerpt_start -->
AsyncRat, A windows based Trojan designed to remotely monitor and control computers through an encrypted connection.
<!-- excerpt_end -->
<br>
<br>

![meme]()

<br>
<br>
<br>

### Sha256Sum
- 53542563788e98bdc1a23102c0cdf82a08e0cfc955f23f38be064811efc2a1a0
- 80f785a35f7487df96bb17b1fe2a67f188417ad017db8efac8d83b3858efcd96
<br>
<br>

### Executive Summary
AsyncRat is a windows based trojan with the intent to control and monitor a computer remotely through an encrypted connection; this malware is written in C#
and has persistence along with sandbox checks during its execution process.
<br>
<br>

### Executive Summary
Upon execution, the binary will unpack its settings and configs with a decrypt call using the CBC Decryption algorithm along with a basic Base64 decipher step.
<br>

Once the malware configuration has been "unpacked", the malware will perform multiple "if" instructions, these instructions contains the Anti-Analysis checks, the persistence
installation mechanism; if any of these checks have failed, it will stop the binary and prevent it from proceeding.
<br>

If the checks have passed without any errors, it will than call back to the C2 for further instructions. <br>
The malware also has the ability to passively collect information regarding cryptowallets addresses.

<br>
<br>

![flowchart]()

<br>
<br>
<br>

### Analysis
![Packed](/images/AsyncRat/NotPacked.png)
The binary isn't in a packed format.
<br>
<br>

![IAT](/images/AsyncRat/IAT.png)
IAT Calls
<br>
<br>

![PersistenceString](/images/AsyncRat/MoreChecksAndPersistence.png)
Signs of Persistence
<br>
<br>
<br>

### DNSPY ANALYSIS
#### As this binary was written in C#, it's pretty easy to check what it's doing with DNSPY lol
![ExecutionFlow](/images/AsyncRat/ExecutionFlow.png)
The Execution Flow of the Malware Decompiled
<br>
<br>

![MalwareFunctions](/images/AsyncRat/Functions.png)
Basic Functions of the C2 client, decompiled
<br>
<br>

### Malware Config Decryption and Encryption
![Cryption Alogrithm](/images/AsyncRat/Encryption.png)
Encryption algorithm for the malware (Base -> CBC(HMAC AES256))
<br>
<br>
<br>

### SandBox Checks
![VMChecks](/images/AsyncRat/VMCheck.png)
Checks for signs of Vmware and Virtualisation
<br>
<br>

![HarddiskCheck](/images/AsyncRat/60GBHDDCHeck.png)
Checks if the hard disk contains more than 60GB of space
<br>
<br>

![DebuggerCheck](/images/AsyncRat/DebuggerCheck.png)
Check if the executable is running in a debugger
<br>
<br>

![OSCheck](/images/AsyncRat/OSCheck.png)
Checks if the PC is running in xp
<br>
<br>
<br>

### Persistence Mechanism
![Task](/images/AsyncRat/scheduledtaskpersist.png)
Persistence through scheduled task's "OnLogin" instruction
<br>
<br>

![registry](/images/AsyncRat/RunRegistryAbuse.png)
![registry2](/images/AsyncRat/RunPersist.png)
![registry3](/images/AsyncRat/RunPersist2.png)
Abusing User registry "Run" to have the malware run on startup
<br>
<br>

### Network Logs
![fakenetcatcher](/images/AsyncRat/C2Callback.png)
![dnsQuery](/images/AsyncRat/WiresharkRequest.png)
The malware will first query the Address name "hxxp[://]com86[.]endofinternet[.]net"
<br>
<br>

![procmon](/images/AsyncRat/procmonTCP.png)
Once the malware can contact the malicious domain, it will being TCP communication between the implant and the server on ports "6606", "7707", "8808".
<br>
<br>





