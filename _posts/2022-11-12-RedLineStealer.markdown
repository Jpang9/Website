---
layout: post
title: "RedLine Stealer Analysis"
categories: blog malware analysis
excerpt_separator: <!-- excerpt_end -->
---
<!-- excerpt_start -->
RedLine Stealer; a stealer type malware distributed through macro-laced office documents designed to steal credentials along with
the function to deploy a second stage malware. This malware is obtainable for 150-200$ on hacker forums, and is intended as malware
as a service.
<!-- excerpt_end -->

![meme]()
<br>
<br>
<br>

### Executive Summary
Stealer type malware primarily written in C++, checks system configuration, than will create a tcp connection 
back to the C2 listener; allowing for further instructions on what to steal along with the ability to deploy a second stage 
malware, usually a trojan. The Redline Stealer samples didn't have any signs of persistence.
<br>
<br>
<br>
<br>


#### SHA256Sum
<u>Sample 1 - Primary Analysis - Process Injection Type</u>
a486e074ab9751f2873e017237fe22ed98dad4214e5d76feec8424fa5166eae5

<u>Sample 2 - Build on Runtime type</u>
8b9c6b974b3aa5d4eeaa4cfa62ac27213b7276c2c20d7a22683e27cd2364c14b

<u>Sample 3 - Build on Runtime type</u>
b06a04969f5856d665a1e837f7aed8b1adfca9e44d06e7d5100b8c3adac4df79
<br>
<br>

### High Level Executive Summary
Upon Execution, The malware will start multiple threads; these threads are used to decrypt the information block which contains
the instructions for redline stealer to execute, these strings are decrypted than arranged into a specific order which than
forms the decrypted instructions for red line stealer.

The decrypted instruction is than stored as a "Variable" within the binary; After the decryption process is completed, it will
perform Process injection to have this code segment execute.

The malware will start and suspend "AppLaunch.exe" (A Legitimate binary from .Net Framework), after AppLaunch.exe has been started,
the malware will then query and write the decoded segment into AppLaunch's memory. 

After the segment has been written into the binary,
the malware will then call the "FlushInstructionCache" Api to remove any traces of process injection instruction.

After the process injection has been carried out, the injected process will now be removed from the suspended state and start querying 
sensitive and system information.

Information retrieved from the enumerating process is written into a SQLITE database and 
exfiltrated via a TCP request, this TCP request will exfiltrate the information and install a second stage malware, assuming that setting has been
configured.
<br>
<br>

![FlowChart]
<br>
<br>
<br>
<br>

### Static Analysis
![DecryptionAPICall](/images/RedLineStealer/DecryptionAPI.png)
Api Calls used by the decryption process, alot of apis related to kernal32.dll.
<br>
<br>

![Packed?](/images/RedLineStealer/VirtualVsRaw.png)
Difference between virtual and raw byte doesn't seem too much, suspect binary is not packed.
<br>
<br>

![XorCall](/images/RedLineStealer/DecryptionStatic.png)
Malcat detected a XOR loop in this part of the binary, used for data decryption or encryption.
<br>
<br>
<br>
<br>

### Dynamic Analysis
![ChildProcess](/images/RedLineStealer/ChildProcess.png)
The Malware spawns a child process of a legitimate binary
<br>
<br>

![TCPCallBack](/images/RedLineStealer/TCPwireshark.png)
![AppLaunchTCP](/images/RedLineStealer/AppLaunchTcpTOC2.png)
![TCPCALLPROCMON](/images/RedLineStealer/ContinousCallsTCP.png)
The malware abuses "AppLaunch.exe" to call back to it's C2.
<br>
<br>

##### Attempted to catch TCP callback with another sample
![SecondarySample](/images/RedLineStealer/SecondSample.png)
![CaughtTCP](/images/RedLineStealer/TCPCATCH.png)
Attempted to catch the TCP request with another sample as it wasn't a process injection type attack. <br>
Response is IP of malicious C2 address.
<br>
<br>


![ThreadCreation](/images/RedLineStealer/DecryptionThreadCalls.png)
Performs Multithreading to quickly decrypt the encrypted data.
<br>
<br>

