---
layout: post
title: "Agent Tesla Analysis"
categories: blog malware analysis
excerpt_separator: <!-- excerpt_end -->
---

<!-- excerpt_start -->
An Analysis on the banking trojan, Agent Tesla; A malware designed to log the input of your device, allowing the attacker to pretty much
record what is being inputted, when the computer is in use.
<!-- excerpt_end -->

(MEME)
<br>
<br>
<br>
<br>

### Executive Statement
MD5

Enumeration Binary - aa5e9af3f263b96805f14058605f21e9

xws.exe - 2b294b3499d1cce794badffc959b7618


Agent Tesla is a 32bit Windows malware written in C#; designed as a banking trojan, it acts a keylogger, logging every bit of information entered
into the infected computer, and if called by the listening post; the malware will than provide the malicious actor with remote
access to said computer, allowing the malware to elevate and spread.

<br>
<br>
<br>
<br>

### High Level Technical Summary
Upon execution, the malware will act as a dropper; decoding and dumping the base64 encoded strings within the binary and arranging
said strings into a sort of enumeration based file, which is than executed alongside the original binary. The enumeration binary will start
checking system and process information, which is than recorded into a text document within the user temp directory.

Once the encoded binary has been dumped, it will begin setting up its persistence mechanism; which is by abusing the RunOnce registry key.

Funny enough, the secondary binary acts as a sacrificial binary as it causes alot of noise due to it quickly enumerating files within the system; along with enumerating
it is also the same binary used to log the user off if the right condition isn't met. This binary allows this to work, as everytime the user
logs off, the "sacrificial binary" is than deleted due to it being in the temp directory, and since the actual dropper malware will just spawn another enumeration
binary, the cycle will continue, until the registry is removed from the system.
<br>

![flowchart](/images/AgentTesla/Flowchart.jpeg)
<br>
<br>
<br>
<br>

### Static Analysis
![mscorlib](/images/AgentTesla/Proofofc%23.png)
The mscorlib library is called, which is an indicator the binary was written in C#
<br>
<br>

![base64encoded](/images/AgentTesla/base64encoded.png)
A bunch of base64 encoded text, which resemble either an encoded binary or encrypted text
<br>
<br>

![Packed?](/images/AgentTesla/packedornot.png)
The difference between the physical and virtual sizes isn't much, so most likely no a packed binary
<br>
<br>

![DNSPYb64](/images/AgentTesla/base64dnsspy.png)
Since the binary was written in C#, we can scalp the file and see what the contents inside are, and from what we can see
the "Luh" looks to be assembling base64 encoded strings and arrange them into order, which leads to them being decoded; whereas the "My"
function looks to be the enumeration binary
<br>
<br>
<br>
<br>

### Dynamic Analysis


![childprocess](/images/AgentTesla/childprocess.png)
The main malware spawns child binary, we can expect this to be the enumeration binary.
<br>
<br>

![Persistence](/images/AgentTesla/persistence.png)
The malware abuses "HKEY_CURRENT_USER\software\microsoft\windows\currentversion\run" as a persistence mechanism.
<br>
<br>

![Dropperlocation](/images/AgentTesla/dumplocation.png)
Where the files end up being dropped too, since it's in the temp file, it's a good way to get rid of the binary without extra code.
<br>
<br>

![renamedchild](/images/AgentTesla/rebootnewname.png)
Once rebooted, the binary is now renamed.
<br>
<br>

![werfaultabuse](/images/AgentTesla/werfaultenumassist.png)
The malware uses "Werfault.exe" to assist with the enumeration process
<br>
<br>

![TCPinfo](/images/AgentTesla/requestparams.png)
![Moreenum](/images/AgentTesla/enumbinaryenuming.png)
Queries settings for request other settings
<br>
<br>

![InfoStorage](/images/AgentTesla/enumfile.png)
![Info](/images/AgentTesla/enuminfo.png)
The enumerated information goes right into the Temp Directory, contains device information.
<br>
<br>

![Requesttodyndns](/images/AgentTesla/dyndnsquery.png)
The binary makes a request to "Checkip.dyndns.org", allowing for a network check and for the malware to grab the device's public
address.
<br>
<br>

![failcondition](/images/AgentTesla/callingshutdownscript.png)
![childcmd](/images/AgentTesla/shutdownscript.png)
If the malware cannot reach the listener or reach the public network, it will shut the device down and have it reboot constantly, 
due to the persistence mechanism
<br>
<br>











