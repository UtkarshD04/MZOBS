import fs from 'fs';
import path from 'path';
import https from 'https';

const targetDir = 'd:/Mzobs/Landing-Frontend/public/images/new_images';

const images = {
  "our_goal.jpg": "https://images.unsplash.com/photo-1600880292089-ce09367ecea2?auto=format&fit=crop&w=1200&q=85",
  "approach.jpg": "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=85",
  "employee_goal.jpg": "https://images.unsplash.com/photo-1521898284481-a5ec348cb555?auto=format&fit=crop&w=1200&q=85",
  "employee_approach.jpg": "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=1200&q=85",
  "cta_band.jpg": "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=2000&q=85",
  "featured_card.jpg": "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1200&q=85",
  "emp_feature_1.jpg": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=85",
  "emp_feature_2.jpg": "https://images.unsplash.com/photo-1586281380117-5a60ae2050cc?auto=format&fit=crop&w=800&q=85",
  "emp_feature_3.jpg": "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=800&q=85",
  "emp_feature_4.jpg": "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=800&q=85",
  "employer_feature_1.jpg": "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=800&q=85",
  "employer_feature_2.jpg": "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=85",
  "employer_feature_3.jpg": "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=85",
  "employer_feature_4.jpg": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=85",
  "galleria_5_fix.jpg": "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=85"
};

function download(url, filePath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filePath);
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        fs.unlinkSync(filePath);
        return download(res.headers.location, filePath).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        file.close();
        fs.unlinkSync(filePath);
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
    }).on('error', (err) => {
      fs.unlink(filePath, () => { });
      reject(err);
    });
  });
}

async function main() {
  for (const [filename, url] of Object.entries(images)) {
    const filePath = path.join(targetDir, filename);
    try {
      await download(url, filePath);
      const size = fs.statSync(filePath).size;
      console.log(`OK: ${filename} (${size} bytes)`);
    } catch (e) {
      console.error(`FAIL: ${filename} - ${e.message}`);
    }
  }
  console.log("Done downloading extra images.");
}

main();
