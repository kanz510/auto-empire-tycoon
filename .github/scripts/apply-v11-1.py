from pathlib import Path
r=Path('.')
def patch(file,old,new):
 p=r/file
 source=p.read_text()
 if source.count(old)!=1:
  raise SystemExit(f'Unexpected anchor in {file}: {source.count(old)}')
 p.write_text(source.replace(old,new))
patch('src/save-state.js',"function save(f){if(!owner||!ownSave())return false;","let resetting=false;\nfunction save(f){if(resetting||!owner||!ownSave())return false;")
patch('src/ui.js',"if(d.a=='reset'&&confirm('Xóa toàn bộ tiến trình?')){try{","if(d.a=='reset'&&confirm('Xóa toàn bộ tiến trình?')){resetting=true;try{")
patch('src/graphics.js',"function tap(x,y){ray.setFromCamera({x:x/innerWidth*2-1,y:-(y/innerHeight)*2+1},cam);const h=ray.intersectObjects(hit,true);if(h.length){let k=h[0].object.userData.key;focus(k);openP(k=='park'?'show':k)}else closeP()}","function tap(x,y){ray.setFromCamera({x:x/innerWidth*2-1,y:-(y/innerHeight)*2+1},cam);const h=ray.intersectObjects(hit,true);let o=h[0]&&h[0].object,k;while(o&&!k){k=o.userData.key;o=o.parent}if(k){focus(k);openP(k=='park'?'show':k)}else closeP()}")
patch('src/save-state.js',"function orderCar(){if(S.orders.length>=3)return;const k=KS.filter(k=>CARS[k].lv<=S.show)[Math.floor(R()*S.show)%KS.filter(k=>CARS[k].lv<=S.show).length];S.orders.push({id:++S.orderId,k,elapsed:0});save();refreshP(1)}","function orderCar(){if(S.orders.length>=3)return;const un=KS.filter(x=>CARS[x].lv<=S.show),k=un[Math.floor(R()*un.length)];S.orders.push({id:++S.orderId,k,elapsed:0});save();refreshP(1)}")
with (r/'PROGRESS.md').open('a') as f:
 f.write("\n## Fix v11.1 (2026-11-01)\n- Reset: chặn save() khi đang reset để pagehide không khôi phục tiến trình đã xóa; giữ nguyên save key aet6, aet6-backup, aet5, aet1.\n- Tương tác: tìm userData.key từ mesh GLB lên các node cha trước khi mở panel, tránh panel trống/cũ khi chạm nhân viên.\n- Đơn đặt xe: chọn ngẫu nhiên từ toàn bộ các loại xe đã mở khóa, gồm sport ở showroom cấp 3.\n- Bổ sung tests/fix-v11-1.cjs kiểm tra reset qua reload, chạm GLB, orderCar. Không thay gameplay khác, UI hay cơ chế offline.\n- Chưa kiểm thử trực tiếp trên Safari iPhone thật.\n")

