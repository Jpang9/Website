---
layout: post
title:  "WannaCry Malware Analysis"
date:   2022-10-24 20:00:00 +1000
categories: blog malanalysis 
excerpt_separator: <!-- excerpt_end -->
---
## WannaCry Malware Analysis

<!-- excerpt_start -->
<p>This was my analysis on the Wannacry ransomware, which I performed while I was studying in the TCM malware analysis lab.</p>
<!-- excerpt_end -->
<br>
<br>
<br>

### Executive Summary
<p>Md5 - db349b97c37d22f5ea1d1841e3c89eb4</p>
<p>The wannaCry Ransomware abuses the [EternalBlue Exploit](https://www.avast.com/c-eternalblue), thus allowing the malware
to gain administrator privileges upon accessing the machine; the Malware checks for other machines within
the subnet with ARP calls, creates a hidden folder within C:\ which extracts the TOR browser for bitcoin payment, than encrypts everything
that isn't in SYSTEM32 or essential for the system to run.</p>
<br>
<br>

### High-Level Technical Summary
<p>WannaCry Attempts to connect to hxxp[://]www[.]iuqerfsodp9ifjaposdfjhgosurijfaewrwergwea[.]com, if connection to this url fails, the malware to proceed as normal, encrypting
and trying to spread to other host vulnerable to the EternalBlue Exploit. The malware unpacks into C:\, uses task scheduler for 
persistence, checks for other host within the network, encrypts all files, finally starts scanning random IPs within the WWW 
for host with this same vulnerability.</p>
<p>![Graph](/images/Wannacry/WannacryGraph.jpeg)</p>
