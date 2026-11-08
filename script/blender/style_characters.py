"""Valentine wardrobe pass. Run in the imported Valentine_Character_Studio via Blender MCP.
Keeps master character files untouched; only modifies the dedicated CHAR collections.
"""
import bpy
import os

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

def material(name, color):
    mat = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    mat.use_nodes = True
    shader = next(n for n in mat.node_tree.nodes if n.type == 'BSDF_PRINCIPLED')
    shader.inputs['Base Color'].default_value = (*color, 1)
    shader.inputs['Roughness'].default_value = 0.82
    return mat

def run():
    cream = material('VR Oatmeal knit', (0.62, 0.46, 0.31))
    burgundy = material('VR Burgundy knit', (0.25, 0.032, 0.065))
    ivory = material('VR Ivory cotton', (0.87, 0.78, 0.63))
    denim = material('VR Indigo denim', (0.055, 0.09, 0.14))
    taupe = material('VR Cocoa trousers', (0.16, 0.10, 0.07))
    male = bpy.data.collections['CHAR_Male']
    female = bpy.data.collections['CHAR_Female']
    female_rig = next(o for o in female.objects if o.type == 'ARMATURE')
    for obj in male.objects:
        if obj.type != 'MESH':
            continue
        if any(term in obj.name for term in ['cardigan', 'knit sleeve', 'Patch pocket']):
            obj.data.materials.clear()
            obj.data.materials.append(cream)
        elif 'trousers' in obj.name:
            obj.data.materials.clear()
            obj.data.materials.append(taupe)
    for obj in list(female.objects):
        if obj.type != 'MESH':
            continue
        if any(term in obj.name for term in ['shoulder bag', 'short sleeve', 'knee fraying']):
            obj.hide_render = True
            obj.hide_set(True)
        elif 'grey top' in obj.name:
            obj.data.materials.clear()
            obj.data.materials.append(ivory)
        elif 'jeans' in obj.name or 'knee beneath' in obj.name:
            obj.data.materials.clear()
            obj.data.materials.append(denim)
    for source in list(male.objects):
        if source.type != 'MESH' or not any(term in source.name for term in ['cardigan', 'knit sleeve', 'Patch pocket']):
            continue
        name = 'Female_Valentine_' + source.name.removeprefix('Male_')
        if bpy.data.objects.get(name):
            continue
        obj = source.copy()
        obj.data = source.data.copy()
        obj.name = name
        female.objects.link(obj)
        obj.parent = female_rig
        for vert in obj.data.vertices:
            vert.co.x *= 0.92
            vert.co.y *= 0.94
        for mod in obj.modifiers:
            if mod.type == 'ARMATURE':
                mod.object = female_rig
        obj.data.materials.clear()
        obj.data.materials.append(burgundy)
    for label in ['Male', 'Female']:
        col = bpy.data.collections['CHAR_' + label]
        rig = next(o for o in col.objects if o.type == 'ARMATURE')
        rig.animation_data_clear()
        for bone in rig.pose.bones:
            bone.matrix_basis.identity()
        for obj in col.objects:
            if obj.type == 'MESH':
                for polygon in obj.data.polygons:
                    polygon.use_smooth = True
    bpy.context.scene.frame_set(1)
    os.makedirs(os.path.join(ROOT, 'art', 'characters', 'valentine'), exist_ok=True)
    bpy.ops.wm.save_as_mainfile(filepath=os.path.join(ROOT, 'art', 'characters', 'valentine', 'wardrobe-studio.blend'))
    print('Wardrobe updated; source masters preserved.')

if __name__ == '__main__':
    run()
