"""Visual QA/poster from the same geometry used by the website.
First run node script/preview-geometry.mjs [--explore], then run this in the working Blender.
"""
import bpy
import os
import json
from mathutils import Vector

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

def run(explore=False):
    scene = bpy.context.scene
    col = bpy.data.collections.get('ENV_RuntimePreview')
    if col:
        for obj in list(col.objects):
            bpy.data.objects.remove(obj, do_unlink=True)
    else:
        col = bpy.data.collections.new('ENV_RuntimePreview')
        scene.collection.children.link(col)
    materials = {}
    with open(os.path.join(ROOT, '.qa', 'scene-preview.json'), encoding='utf-8') as source:
        meshes = json.load(source)
    for item in meshes:
        pos, idx = item['positions'], item['indices']
        vertices = [(pos[i], -pos[i + 2], pos[i + 1]) for i in range(0, len(pos), 3)]
        faces = [tuple(idx[i:i + 3]) for i in range(0, len(idx), 3)]
        mesh = bpy.data.meshes.new(item['name'])
        mesh.from_pydata(vertices, [], faces)
        mesh.update()
        obj = bpy.data.objects.new(item['name'], mesh)
        col.objects.link(obj)
        color = item['color']
        if color not in materials:
            mat = bpy.data.materials.new('VR_Preview_' + color)
            mat.use_nodes = True
            shader = next(node for node in mat.node_tree.nodes if node.type == 'BSDF_PRINCIPLED')
            rgb = [int(color[i:i + 2], 16) / 255 for i in (0, 2, 4)]
            rgb = [value / 12.92 if value < .04045 else ((value + .055) / 1.055) ** 2.4 for value in rgb]
            shader.inputs['Base Color'].default_value = (*rgb, 1)
            shader.inputs['Roughness'].default_value = .65
            if color == 'ffe4a4':
                shader.inputs['Emission Color'].default_value = (*rgb, 1)
                shader.inputs['Emission Strength'].default_value = 3
            materials[color] = mat
        mesh.materials.append(materials[color])
        for polygon in mesh.polygons:
            polygon.use_smooth = True
    for label, sign in [('Male', -1), ('Female', 1)]:
        rig = next(obj for obj in bpy.data.collections['CHAR_' + label].objects if obj.type == 'ARMATURE')
        rig.location = (sign * .47, .5, 0)
        rig.scale = (1, 1, 1) if label == 'Male' else (.97, .97, .97)
    scene.frame_set(220 if explore else 1)
    if not scene.world:
        scene.world = bpy.data.worlds.new('VR_PreviewWorld')
    scene.world.use_nodes = True
    background = next(node for node in scene.world.node_tree.nodes if node.type == 'BACKGROUND')
    background.inputs[0].default_value = (.16, .09, .2, 1)
    cam = scene.camera
    if not cam:
        cam = bpy.data.objects.new('VR_PreviewCamera', bpy.data.cameras.new('VR_PreviewCamera'))
        scene.collection.objects.link(cam)
        scene.camera = cam
    cam.data.type = 'ORTHO'
    cam.location = (0, -1.35, 3.8) if explore else (2.2, -5.4, 2.5)
    target = Vector((0, -.18, 1.08)) if explore else Vector((0, .05, 1.15))
    cam.rotation_euler = (target - cam.location).to_track_quat('-Z', 'Y').to_euler()
    cam.data.ortho_scale = 3.08 if explore else 6.4
    scene.render.resolution_x = 1400
    scene.render.resolution_y = 700
    scene.render.resolution_percentage = 100
    scene.render.engine = 'BLENDER_EEVEE_NEXT'
    scene.render.image_settings.file_format = 'JPEG'
    scene.render.image_settings.quality = 88
    output = os.path.join(ROOT, '.qa', 'gift-explore.jpg') if explore else os.path.join(ROOT, 'public', 'posters', 'garden.jpg')
    os.makedirs(os.path.dirname(output), exist_ok=True)
    scene.render.filepath = output
    bpy.ops.render.render(write_still=True)
    os.makedirs(os.path.join(ROOT, 'art', 'environment'), exist_ok=True)
    bpy.ops.wm.save_as_mainfile(filepath=os.path.join(ROOT, 'art', 'environment', 'rooftop-preview.blend'))
    print('Saved preview: ' + output)

if __name__ == '__main__':
    run(globals().get('EXPLORE', False))
