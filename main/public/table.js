document.addEventListener("DOMContentLoaded", () => {
  fetch("/api/vlans")
    .then((response) => response.json())
    .then((data) => {
      const vlanUl = document.getElementById("vlan-ul");
      data.forEach((vlanGroup, index) => {
        vlanGroup.forEach((vlan) => {
          const li = document.createElement("li");
          li.textContent = `VLAN: ${vlan.VLAN}, User-count: ${vlan.SERV_Port_NUM}`;
          vlanUl.appendChild(li);
        });
      });
    })
    .catch((error) => console.error("Error fetching VLAN data:", error));
});
