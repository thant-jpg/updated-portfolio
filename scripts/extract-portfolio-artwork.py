"""Extract individual illustrations from rendered PDF sheets for editable web layouts."""
from pathlib import Path
from PIL import Image
import json
specs={
 'stacked-streets':dict(heading='A neighbourhood in section',body='Homes and public sky streets alternate through the building. Shops, workshops, shared facilities and gardens support different rhythms of living and working.',assets=[(25,[.086,.425,.309,.881],'Ground floor plan'),(26,[.084,.136,.365,.337],'Unit distribution'),(27,[.377,.087,.919,.909],'Building section'),(28,[.126,.083,.872,.904],'Axonometric drawing'),(29,[.36,.113,.916,.547],'Long section'),(29,[.642,.604,.924,.883],'Street-level experience')]),
 'the-wandering-archive':dict(heading='Mobility, shelter and shared knowledge',body='The project explores a library system for a nomadic community adapting to cave dwellings, combining mobile structures with the permanence of the landscape.',assets=[(18,[.085,.113,.376,.521],'Site model'),(18,[.425,.113,.915,.519],'Concept diagram'),(19,[.085,.587,.551,.887],'Spatial model studies'),(21,[.085,.511,.358,.894],'Section cut'),(17,[.438,.111,.914,.506],'Environment render'),(22,[.085,.113,.557,.562],'Interior experience')]),
 'a-bridge':dict(heading='From structural model to full scale',body='This group project developed a 4.7 m bridge through design consultations, structural testing and a three-day fabrication period. Folded metal joints connect material behaviour with the expression of the structure.',assets=[(31,[.085,.111,.287,.602],'Front-view model'),(31,[.602,.113,.916,.883],'Full-scale bridge'),(32,[.085,.113,.378,.415],'Joint model'),(32,[.425,.111,.915,.647],'Fabricated metal joint'),(33,[.426,.543,.915,.887],'The completed bridge')]),
 'spatial':dict(heading='Modelling the everyday',body='A building, a room and an everyday object became studies in modelling and representation. The room model records a lived-in space rather than an idealised interior.',assets=[(4,[.427,.113,.916,.804],'Isometric room drawing'),(6,[.353,.084,.917,.919],'Building model'),(6,[.043,.135,.334,.423],'Building elevation'),(7,[.31,.09,.94,.9],'Exploded object drawing')]),
 'flow':dict(heading='Form shaped by movement',body='Starting with a 25 × 25 cm paper model, the study explores wave-like roof forms, sheltered interior spaces and a structure that feels continuous with the terrain.',assets=[(9,[.399,.111,.915,.887],'Physical model'),(9,[.086,.111,.285,.359],'Early paper study'),(10,[.085,.555,.376,.886],'Top-view model'),(11,[.317,.111,.914,.887],'Isometric study'),(10,[.424,.112,.916,.885],'Section drawing')]),
 'ribbon':dict(heading='From generated image to parametric geometry',body='A group staircase study developed from AI-generated imagery into Grasshopper geometry and a BIM model assembled in Revit.',assets=[(13,[.428,.076,.914,.384],'Grasshopper definition'),(14,[.084,.119,.526,.389],'Parametric development'),(14,[.659,.369,.872,.657],'Geometry iteration'),(15,[.39,.062,.929,.741],'Revit model'),(15,[.074,.111,.385,.45],'Top-view render')]),
 'previously':dict(heading='Studies across scales and media',body='Earlier work brings together architectural drafting, digital models, visualisation, detail drawings and observational painting.',assets=[(35,[.086,.109,.914,.91],'Architectural drafting'),(37,[.447,.152,.94,.823],'Digital model'),(39,[.486,.113,.93,.521],'Detail drawing'),(40,[.084,.111,.525,.909],'Urban sketch'),(40,[.528,.109,.916,.909],'Light and colour study'),(41,[.113,.111,.916,.909],'Still-life painting')])
}
manifest_text=Path('portfolio-projects.mjs').read_text(encoding='utf-8');projects=json.loads(manifest_text.split('export const portfolioProjects=',1)[1].rstrip().removesuffix(';'));page_lookup={page['sourcePage']:page for p in projects for page in p['sourcePages']}
out={}
for slug,spec in specs.items():
 records=[];folder=Path('public/images/portfolio')/slug/'artwork';folder.mkdir(parents=True,exist_ok=True)
 for index,(number,box,caption) in enumerate(spec['assets'],1):
  page=page_lookup[number];rendered=Path(f'tmp/portfolio-trim/page-{number:02d}.png');image=Image.open(rendered).convert('RGB')
  scale=image.width/841.89;left,top,right,bottom=box
  coords=(round(left*image.width),max(0,round((top*595.44-46)*scale)),round(right*image.width),min(image.height,round((bottom*595.44-46)*scale)))
  crop=image.crop(coords);crop.thumbnail((2000,2000));dest=folder/f'{index:02d}.webp';crop.save(dest,'WEBP',quality=94,method=5)
  records.append(dict(src='/'+dest.relative_to('public').as_posix(),caption=caption,width=crop.width,height=crop.height,sourcePage=number))
 out[slug]=dict(heading=spec['heading'],body=spec['body'],images=records)
 print('Extracted '+slug+': '+str(len(records))+' visuals',flush=True)
Path('portfolio-artwork.mjs').write_text('// Editable project layouts. Replace image paths and captions here as new material arrives.\nexport const portfolioArtwork='+json.dumps(out,ensure_ascii=False,indent=2)+';\n',encoding='utf-8')
